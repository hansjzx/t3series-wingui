package com.zionex.t3series.web.domain.engine.license;

import static java.nio.file.StandardWatchEventKinds.ENTRY_CREATE;
import static java.nio.file.StandardWatchEventKinds.ENTRY_DELETE;
import static java.nio.file.StandardWatchEventKinds.ENTRY_MODIFY;
import static java.nio.file.StandardWatchEventKinds.OVERFLOW;

import java.io.File;
import java.io.IOException;
import java.nio.file.FileSystems;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.WatchEvent;
import java.nio.file.WatchKey;
import java.nio.file.WatchService;
import java.util.concurrent.atomic.AtomicBoolean;

import org.apache.commons.lang3.exception.ExceptionUtils;

import com.zionex.t3simpleserver.common.ApplicationConstants;
import com.zionex.t3series.util.time.TimeStamp;

import lombok.extern.slf4j.Slf4j;

@Slf4j
public class LicenseFileWatcher extends Thread {

    private final LicenseManager licenseManager;
    private final String filePath;

    // check last modified time
    private File xmlFile = null;
    private File binFile = null;
    private long xmlFileTime = 0L;
    private long binFileTime = 0L;

    // check changed file
    TimeStamp modifyTime = null;
    boolean isXmlChanged = false;
    boolean isBinChanged = false;

    private final AtomicBoolean stop = new AtomicBoolean(false);

    public LicenseFileWatcher(LicenseManager licenseManager, final String filePath) {
        this.licenseManager = licenseManager;
        this.filePath = filePath;

        setOriginalFileTime();
    }

    public boolean isStopped() {
        return stop.get();
    }

    public void stopThread() {
        stop.set(true);
    }

    private void setOriginalFileTime() {
        xmlFile = new File(filePath + ApplicationConstants.FILE_LICENSE_XML);
        binFile = new File(filePath + ApplicationConstants.FILE_LICENSE_BIN);

        xmlFileTime = xmlFile.lastModified();
        binFileTime = binFile.lastModified();
    }

    private void initializeStatus() {
        modifyTime = null;
        isXmlChanged = false;
        isBinChanged = false;
    }

    @Override
    public void run() {
        try {
            WatchService xmlWatcher = FileSystems.getDefault().newWatchService();
            WatchService binWatcher = FileSystems.getDefault().newWatchService();

            Path dir = Paths.get(filePath);
            dir.register(xmlWatcher, ENTRY_CREATE, ENTRY_DELETE, ENTRY_MODIFY, OVERFLOW);
            dir.register(binWatcher, ENTRY_CREATE, ENTRY_DELETE, ENTRY_MODIFY, OVERFLOW);

            log.info("Watch Service registered for dir: {}", dir.getFileName());

            while (!isStopped()) {
                WatchKey xmlKey;
                WatchKey binKey;

                xmlKey = xmlWatcher.take();
                binKey = binWatcher.take();

                if (!isXmlChanged) {
                    isXmlChanged = validateWatchEvent(xmlKey, ApplicationConstants.FILE_LICENSE_XML);
                }

                if (!isBinChanged) {
                    isBinChanged = validateWatchEvent(binKey, ApplicationConstants.FILE_LICENSE_BIN);
                }

                if (isXmlChanged || isBinChanged) {
                    if (modifyTime == null) {
                        modifyTime = new TimeStamp(System.currentTimeMillis());
                    }

                    if (isXmlChanged && isBinChanged) {
                        licenseManager.licenseFileChanged();
                        initializeStatus();
                    }

                    TimeStamp currentTime = new TimeStamp(System.currentTimeMillis());
                    if (modifyTime != null && modifyTime.getIntervalFrom(currentTime) > 3000) {
                        initializeStatus();
                    }
                }

                boolean valid = xmlKey.reset();
                if (!valid) {
                    break;
                }

                boolean valid2 = binKey.reset();
                if (!valid2) {
                    break;
                }

                Thread.yield();
            }

            xmlWatcher.close();
            binWatcher.close();

            log.info("Watch service closed.");

        } catch (IOException ex) {
            log.warn(ex.getMessage());
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            log.warn(ExceptionUtils.getStackTrace(e));
        }
    }

    private boolean validateWatchEvent(WatchKey key, String targetFileName) {
        if (key == null) {
            Thread.yield();
            return false;
        }

        for (WatchEvent<?> event : key.pollEvents()) {
            // get event type
            WatchEvent.Kind<?> kind = event.kind();

            // get file name
            @SuppressWarnings("unchecked")
            WatchEvent<Path> ev = (WatchEvent<Path>) event;
            Path fileName = ev.context();

            if (kind.equals(ENTRY_CREATE) || kind.equals(ENTRY_DELETE) || kind.equals(ENTRY_MODIFY) || kind.equals(OVERFLOW)) {
                if (!targetFileName.equals(fileName.toString())) {
                    continue;
                }

                if (log.isInfoEnabled()) {
                    log.info("{} : {}", kind.name(), fileName);
                }

                try {
                    // delay time for applying change file
                    Thread.sleep(1000);
                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt();
                }

                if (targetFileName.toLowerCase().endsWith(".xml")) {
                    long modifiedFileTime = xmlFile.lastModified();
                    if (xmlFileTime != modifiedFileTime) {
                        xmlFileTime = modifiedFileTime;
                        return true;
                    }

                } else {
                    long modifiedFileTime = binFile.lastModified();
                    if (binFileTime != modifiedFileTime) {
                        binFileTime = modifiedFileTime;
                        return true;
                    }
                }
            }
        }

        return false;
    }

}
