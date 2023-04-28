package com.zionex.t3series.web.util.excel;

import java.awt.font.FontRenderContext;
import java.awt.font.LineBreakMeasurer;
import java.awt.font.TextAttribute;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;

import java.text.AttributedString;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.openxml4j.exceptions.InvalidFormatException;
import org.apache.poi.ss.usermodel.BorderStyle;
import org.apache.poi.ss.usermodel.Cell;

import org.apache.poi.ss.usermodel.CellType;
import org.apache.poi.ss.usermodel.Comment;
import org.apache.poi.ss.usermodel.FillPatternType;
import org.apache.poi.ss.usermodel.HorizontalAlignment;
import org.apache.poi.ss.usermodel.IndexedColors;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.ShapeTypes;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.VerticalAlignment;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.ss.util.CellRangeAddress;
import org.apache.poi.util.Units;
import org.apache.poi.xssf.usermodel.IndexedColorMap;
import org.apache.poi.xssf.usermodel.XSSFCell;
import org.apache.poi.xssf.usermodel.XSSFCellStyle;
import org.apache.poi.xssf.usermodel.XSSFClientAnchor;
import org.apache.poi.xssf.usermodel.XSSFColor;
import org.apache.poi.xssf.usermodel.XSSFDrawing;
import org.apache.poi.xssf.usermodel.XSSFFont;
import org.apache.poi.xssf.usermodel.XSSFRichTextString;
import org.apache.poi.xssf.usermodel.XSSFRow;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFSimpleShape;
import org.apache.poi.xssf.usermodel.XSSFTextBox;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import java.awt.Color;

/**
 * 엑셀 파일을 만들기 위한 클래스
 */
public class ExcelContext {

    private Map<String, XSSFSheet> sheetMap;
    private XSSFWorkbook workbook;

    public ExcelContext() {
        workbook = new XSSFWorkbook();
        sheetMap = new HashMap<String, XSSFSheet>();
    }

    public XSSFSheet addSheet(String sheetName) {
        if (sheetMap.containsKey(sheetName) == false) {
            XSSFSheet sheet = this.workbook.createSheet(sheetName);
            sheetMap.put(sheetName, sheet);
            return sheet;
        } else {
            return sheetMap.get(sheetName);
        }
    }

    public XSSFSheet getSheet(String sheetName) {
        if (sheetMap.containsKey(sheetName) == false) {
            XSSFSheet sheet = this.workbook.createSheet(sheetName);
            sheetMap.put(sheetName, sheet);
            return sheet;
        } else {
            return sheetMap.get(sheetName);
        }
    }

    public static float pixelToPoint(final int pixels) {
        return (float) pixels * (float) Units.PIXEL_DPI / (float) Units.POINT_DPI;
    }

    public static float pixelToExcelUnit(final int pixels) {
        return pixelToPoint(pixels * 20);
    }

    public void setCellWidth(XSSFSheet sheet, int cellnum, int width) {
        sheet.setColumnWidth(cellnum, (int) pixelToExcelUnit(width));
    }

    public void setRowHeight(XSSFSheet sheet, int rownum, int height) {
        XSSFRow row = sheet.getRow(rownum);
        row.setHeightInPoints((float) pixelToPoint(height));
    }

    public void setCell(XSSFSheet sheet, int cellnum, int rownum, XSSFCellStyle cellStyle, String cellValue) {
        XSSFRow row = sheet.getRow(rownum);
        if (row == null) {
            row = sheet.createRow(rownum);
        }

        XSSFCell cell = row.getCell(cellnum);
        if (cell == null) {
            cell = row.createCell(cellnum, CellType.STRING);
        }

        cell.setCellStyle(cellStyle);
        cell.setCellValue(cellValue);
    }

    public XSSFRow getRow(XSSFSheet sheet, int rownum) {
        XSSFRow row = sheet.getRow(rownum);
        if (row == null) {
            row = sheet.createRow(rownum);
        }
        return row;
    }

    public XSSFCell getCell(XSSFSheet sheet, int cellnum, int rownum) {
        XSSFRow row = getRow(sheet, rownum);
        XSSFCell cell = row.getCell(cellnum);
        if (cell == null) {
            cell = row.createCell(cellnum, CellType.STRING);
        }
        return cell;
    }

    public String getCellValue(XSSFSheet sheet, int cellnum, int rownum) {
        XSSFCell cell = getCell(sheet, cellnum, rownum);
        return cell.getStringCellValue();
    }

    // colorStr 예) #efefef
    public static java.awt.Color hex2Rgb(String colorStr) {
        return Color.decode(colorStr);
    }

    public XSSFCellStyle createCellStyle(XSSFSheet sheet, String backgroundColor, boolean boldweight) {
        XSSFCellStyle cellStyle = sheet.getWorkbook().createCellStyle();

        cellStyle.setAlignment(HorizontalAlignment.CENTER);
        cellStyle.setVerticalAlignment(VerticalAlignment.CENTER);
        if (backgroundColor != null) {
            XSSFColor color = this.getXssfColor(backgroundColor);
            cellStyle.setFillForegroundColor(color);
            cellStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);
        }
        setSolidBorder(cellStyle);

        if (boldweight == true) {
            XSSFFont font = sheet.getWorkbook().createFont();
            font.setBold(true);
            cellStyle.setFont(font);
        }
        return cellStyle;
    }

    public XSSFCellStyle createCellStyle(XSSFSheet sheet, String backgroundColor) {
        XSSFCellStyle cellStyle = sheet.getWorkbook().createCellStyle();

        cellStyle.setAlignment(HorizontalAlignment.CENTER);
        cellStyle.setVerticalAlignment(VerticalAlignment.CENTER);
        if (backgroundColor != null) {
            XSSFColor color = this.getXssfColor(backgroundColor);
            cellStyle.setFillForegroundColor(color);
            cellStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);
        }
        return cellStyle;
    }

    public void setCellBackColor(XSSFSheet sheet, int cellnum, int rownum, String backgroundColor, XSSFCellStyle defCellStyle) {
        XSSFCell cell = getCell(sheet, cellnum, rownum);
        cell.setCellStyle(defCellStyle);
    }

    public void setFontColor(XSSFSheet sheet, XSSFCellStyle style, String fontColorHex) {
        XSSFFont font = style.getFont();
        if (font == null) {
            font = sheet.getWorkbook().createFont();
        }
        font.setColor(getXssfColor(fontColorHex));
    }

    public void setSolidBorder(XSSFCellStyle cellStyle) {
        cellStyle.setBottomBorderColor(IndexedColors.BLACK.getIndex());
        cellStyle.setLeftBorderColor(IndexedColors.BLACK.getIndex());
        cellStyle.setTopBorderColor(IndexedColors.BLACK.getIndex());
        cellStyle.setRightBorderColor(IndexedColors.BLACK.getIndex());
        cellStyle.setBorderBottom(BorderStyle.THIN);
        cellStyle.setBorderTop(BorderStyle.THIN);
        cellStyle.setBorderRight(BorderStyle.THIN);
        cellStyle.setBorderLeft(BorderStyle.THIN);
    }

    public void write(OutputStream outputStream) throws IOException {

        this.workbook.write(outputStream);
        this.workbook.close();
    }

    public void merge(XSSFSheet sheet, int firstCol, int firstRow, int lastCol, int lastRow) {
        // 셀 병합
        CellRangeAddress mergeInfo = new CellRangeAddress(firstRow, lastRow, firstCol, lastCol);
        sheet.addMergedRegion(mergeInfo);
    }

    public void merge(XSSFSheet sheet, CellRangeAddress m) {
        sheet.addMergedRegion(m);
    }

    public void addCellComment(XSSFSheet sheet, int cellnum, int rownum, String commentText) {
        XSSFDrawing patr = (XSSFDrawing) sheet.createDrawingPatriarch();
        Comment comment = patr.createCellComment(new XSSFClientAnchor(0, 0, 0, 0, (short) 4, 2, (short) 6, 5));
        comment.setString(new XSSFRichTextString(commentText));
        getCell(sheet, cellnum, rownum).setCellComment(comment);
    }

    public boolean equals(Object o, Object o2) {
        if (o == null || !(o instanceof XSSFClientAnchor) || o2 == null || !(o2 instanceof XSSFClientAnchor)) {
            return false;
        }

        XSSFClientAnchor anchor = (XSSFClientAnchor) o;
        XSSFClientAnchor anchor2 = (XSSFClientAnchor) o2;
        return anchor2.getDx1() == anchor.getDx1() &&
                anchor2.getDx2() == anchor.getDx2() &&
                anchor2.getDy1() == anchor.getDy1() &&
                anchor2.getDy2() == anchor.getDy2() &&
                anchor2.getCol1() == anchor.getCol1() &&
                anchor2.getCol2() == anchor.getCol2() &&
                anchor2.getRow1() == anchor.getRow1() &&
                anchor2.getRow2() == anchor.getRow2();
    }

    public void drawRect(XSSFSheet sheet, int rownum, int scolnum, int ecolnum, int dx1, int dx2, String caption,
                         String backColorHex, String fontColorHex, int fontSize, String tooltip, boolean fixed) {

        XSSFDrawing patriarch = sheet.createDrawingPatriarch();
        XSSFClientAnchor a = new XSSFClientAnchor();
        a.setCol1(scolnum);
        a.setRow1(rownum);

        a.setDx1(pxToEmu(dx1));
        a.setDx2(pxToEmu(dx2));

        a.setDy1(pxToEmu(dx1));
        a.setDy2(pxToEmu(dx2));

        a.setRow2(rownum + 1);
        a.setCol2(ecolnum + 1);

        XSSFSimpleShape shape1 = patriarch.createSimpleShape(a);
        shape1.setShapeType(ShapeTypes.RECT);

        int red = 0, green = 0, blue = 0;

        Color backColor = hex2Rgb(backColorHex);

        red = backColor.getRed();
        green = backColor.getGreen();
        blue = backColor.getBlue();

        if (fixed) {
            shape1.setLineStyleColor(255, 0, 0);
        } else {
            shape1.setLineStyleColor(80, 80, 80);
        }
        shape1.setFillColor(red, green, blue);
        shape1.setLeftInset(5);
        shape1.setTopInset(5);
        shape1.setRightInset(5);
        shape1.setBottomInset(5);

        XSSFTextBox text = patriarch.createTextbox(a);

        XSSFRichTextString richText = new XSSFRichTextString(caption);

        XSSFFont font = this.workbook.createFont();
        font.setColor(getXssfColor(fontColorHex));
        font.setFontName("Arial");
        font.setFontHeight(pixelToPoint(fontSize));

        richText.applyFont(font);
        text.setText(richText);

        if (tooltip != null) {
            Comment comment = patriarch.createCellComment(a);
            XSSFRichTextString str = new XSSFRichTextString(tooltip);
            comment.setString(str);

            // Assign the comment to the cell
            getCell(sheet, scolnum, rownum).setCellComment(comment);
        }
    }

    public byte[] hexToByteArray(String hex) {
        if (hex == null || hex.length() == 0) {
            return null;
        }

        byte[] ba = new byte[hex.length() / 2];
        for (int i = 0; i < ba.length; i++) {
            ba[i] = (byte) Integer.parseInt(hex.substring(2 * i, 2 * i + 2), 16);
        }
        return ba;
    }

    public long getExcelColorLong(String colorStr) {
        java.awt.Color c = Color.decode(colorStr);
        return c.getBlue() * 256 * 256 + c.getGreen() * 256 + c.getRed();
    }

    XSSFColor getXssfColor(String hexString) {
        String hexColor = hexString.startsWith("#") ? hexString.substring(1) : hexString;
        IndexedColorMap colorMap = workbook.getStylesSource().getIndexedColors();
        XSSFColor color = new XSSFColor(colorMap);
        color.setARGBHex(hexColor);
        return color;
    }

    public static int pxToEmu(int px) {
        return px * Units.EMU_PER_PIXEL; // 96dpi
    }

    public static int emuToPx(int emu) {
        return (int) emu / Units.EMU_PER_PIXEL; // 96dpi
    }

    public float getDefaultRowHeightInPoints(XSSFSheet sheet) {
        return sheet.getDefaultRowHeightInPoints();
    }

    public void setRowHeightInPoints(XSSFSheet sheet, int rownum, float height) {
        sheet.getRow(rownum).setHeightInPoints(height);
    }

    public float getRowHeightInPoints(XSSFSheet sheet, int rownum) {
        return sheet.getRow(rownum).getHeightInPoints();
    }

    /**
     * ROW 높이 자동 조절
     * 
     * @param rownum
     * @param cellValue
     */
    public void setAutoRowFit(XSSFSheet sheet, int cellnum, int rownum) {
        XSSFRow row = sheet.getRow(rownum);
        XSSFCell cell = row.getCell(cellnum);
        XSSFFont cellFont = cell.getCellStyle().getFont();
        int fontStyle = java.awt.Font.PLAIN;
        if (cellFont.getBold()) {
            fontStyle = java.awt.Font.BOLD;
        }
        if (cellFont.getItalic()) {
            fontStyle = java.awt.Font.ITALIC;
        }

        java.awt.Font currFont = new java.awt.Font(cellFont.getFontName(), fontStyle, cellFont.getFontHeightInPoints());

        String cellText = cell.getStringCellValue();
        AttributedString attrStr = new AttributedString(cellText);
        attrStr.addAttribute(TextAttribute.FONT, currFont);

        // Use LineBreakMeasurer to count number of lines needed for the text
        FontRenderContext frc = new FontRenderContext(null, true, true);
        LineBreakMeasurer measurer = new LineBreakMeasurer(attrStr.getIterator(), frc);
        int nextPos = 0;
        int lineCnt = 1;
        float columnWidthInPx = sheet.getColumnWidthInPixels(cellnum);
        while (measurer.getPosition() < cellText.length()) {
            nextPos = measurer.nextOffset(columnWidthInPx);
            lineCnt++;
            measurer.setPosition(nextPos);
        }
        int fromIndex = -1;
        while ((fromIndex = cellText.indexOf("\n", fromIndex + 1)) >= 0) {
            lineCnt++;
        }
        if (lineCnt > 1) {
            row.setHeightInPoints(sheet.getDefaultRowHeightInPoints() * lineCnt * /* fudge factor */ 1.1f);
        }
    }

    public static List<List<String>> readExcel(File file) throws IOException, InvalidFormatException {
        return readExcel(new FileInputStream(file), file.getName(), 0);
    }

    public static List<List<String>> readExcel(File file, int sheetAt) throws IOException, InvalidFormatException {
        return readExcel(new FileInputStream(file), file.getName(), sheetAt);
    }

    public static List<List<String>> readExcel(InputStream is) throws IOException, InvalidFormatException {
        return readExcel(is, "xlsx", 0);
    }

    private static Workbook getWorkbook(InputStream inputStream, String fileName) throws IOException {
        Workbook workbook = null;

        if (fileName.endsWith("xlsx")) {
            workbook = new XSSFWorkbook(inputStream);
        } else if (fileName.endsWith("xls")) {
            workbook = new HSSFWorkbook(inputStream);
        } else {
            throw new IllegalArgumentException("The specified file is not Excel file");
        }

        return workbook;
    }

    public static List<List<String>> readExcel(InputStream is, String fileName, int sheetAt) throws IOException, InvalidFormatException {
        List<List<String>> resultList = new ArrayList<>();
        // 파일을 읽기위해 엑셀파일을 가져온다
        Workbook workbook = getWorkbook(is, fileName);
        int rowindex = 0;
        int columnindex = 0;
        // 시트 수 (첫번째에만 존재하므로 0을 준다)
        // 만약 각 시트를 읽기위해서는 FOR문을 한번더 돌려준다
        Sheet sheet = workbook.getSheetAt(sheetAt);
        // 행의 수
        int rows = sheet.getPhysicalNumberOfRows();
        for (rowindex = 0; rowindex < rows; rowindex++) {
            // 행을 읽는다
            Row row = sheet.getRow(rowindex);
            resultList.add(new ArrayList<String>());
            if (row != null) {
                // 셀의 수
                int cells = row.getPhysicalNumberOfCells();
                for (columnindex = 0; columnindex <= cells; columnindex++) {
                    // 셀값을 읽는다
                    Cell cell = row.getCell(columnindex);
                    String value = "";
                    // 셀이 빈값일경우를 위한 널체크
                    if (rowindex == 0 && cell == null) {
                        continue;
                    }
                    if (cell != null) {
                        // 타입별로 내용 읽기
                        CellType type = cell.getCellType();
                        if (type == CellType.FORMULA) {
                            value = cell.getCellFormula();
                        } else if (type == CellType.NUMERIC) {
                            value = String.format("%1$,.0f", cell.getNumericCellValue());
                        } else if (type == CellType.STRING) {
                            value = cell.getStringCellValue() + "";
                        } else if (type == CellType.BLANK) {
                            value = cell.getBooleanCellValue() + "";
                        } else if (type == CellType.ERROR) {
                            value = cell.getErrorCellValue() + "";
                        }
                    }

                    if ("false".equals(value)) {
                        value = "";
                    }
                    resultList.get(rowindex).add(value);
                }
            }
        }
        workbook.close();

        return resultList;
    }

}
