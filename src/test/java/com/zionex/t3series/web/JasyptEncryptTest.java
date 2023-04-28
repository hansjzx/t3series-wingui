package com.zionex.t3series.web;

import org.jasypt.encryption.pbe.PooledPBEStringEncryptor;
import org.junit.Test;

public class JasyptEncryptTest {

    private final String encryptKey = "Enter your encryption key";

    @Test
    public void jasypt() {
        String value = "Enter text to encrypt";
        System.out.println("[Result] Orgin: " + value + ", Encrypt: " + jasyptEncrypt(value));
    }

    public String jasyptEncrypt(String value) {
        PooledPBEStringEncryptor pbeEnc = new PooledPBEStringEncryptor();
        pbeEnc.setAlgorithm("PBEWithMD5AndDES");
        pbeEnc.setPoolSize(1);
        pbeEnc.setPassword(encryptKey);
        return pbeEnc.encrypt(value);
    }

}
