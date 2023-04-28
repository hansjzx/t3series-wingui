package com.zionex.t3series.web.domain.fp.master;

import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.zionex.t3series.web.constant.ServiceConstants;
import com.zionex.t3series.web.domain.fp.item.Inventory;
import com.zionex.t3series.web.domain.fp.item.InventoryService;
import com.zionex.t3series.web.domain.fp.item.Item;
import com.zionex.t3series.web.domain.fp.item.ItemGrp;
import com.zionex.t3series.web.domain.fp.item.ItemGrpService;
import com.zionex.t3series.web.domain.fp.item.ItemService;
import com.zionex.t3series.web.util.ResponseMessage;
import com.zionex.t3series.web.util.interceptor.ExecPermission;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/factoryplan/master/item/")
public class ItemMstController {
    
    private final ItemService itemService;
    
    private final ItemGrpService itemGrpService;
    
    private final InventoryService inventoryService;

    private final ObjectMapper objectMapper;

    @ExecPermission(type = ServiceConstants.PERMISSION_TYPE_READ)
    @GetMapping("/items")
    public List<Item> getItems(@RequestParam(value = "search", required = false) String search) throws UnsupportedEncodingException {
        if (search != null) {
            search = URLDecoder.decode(search, "UTF-8");
        }

        return itemService.getItems(search);
    }

    @ExecPermission(type = ServiceConstants.PERMISSION_TYPE_DELETE)
    @PostMapping("/items/delete")
    public ResponseEntity<ResponseMessage> deleteItems(HttpServletRequest request) throws JsonMappingException, JsonProcessingException {
        final List<Item> items = objectMapper.readValue(request.getParameter(ServiceConstants.PARAMETER_KEY_DATA) , new TypeReference<List<Item>>() {});

        itemService.deleteItems(items);
        return new ResponseEntity<>(new ResponseMessage(HttpStatus.OK.value(), "Deleted item entities"), HttpStatus.OK);
    }

    @ExecPermission(type = ServiceConstants.PERMISSION_TYPE_UPDATE)
    @PostMapping("/items")
    public ResponseEntity<ResponseMessage> postItems(HttpServletRequest request) throws JsonMappingException, JsonProcessingException {
        final List<Item> items = objectMapper.readValue(request.getParameter(ServiceConstants.PARAMETER_KEY_DATA) , new TypeReference<List<Item>>() {});

        itemService.saveItems(items);
        return new ResponseEntity<>(new ResponseMessage(HttpStatus.OK.value(), "Inserted or updated item entities"), HttpStatus.OK);
    }

    @ExecPermission(type = ServiceConstants.PERMISSION_TYPE_READ)
    @GetMapping("/itemgroups")
    public List<ItemGrp> getItemGroups(@RequestParam(value = "search", required = false) String search) throws UnsupportedEncodingException {
        if (search != null) {
            search = URLDecoder.decode(search, "UTF-8");
        }

        return itemGrpService.getItemGroups(search);
    }

    @ExecPermission(type = ServiceConstants.PERMISSION_TYPE_DELETE)
    @PostMapping("/itemgroups/delete")
    public ResponseEntity<ResponseMessage> deleteItemGroups(HttpServletRequest request) throws JsonMappingException, JsonProcessingException {
        final List<ItemGrp> itemGroups = objectMapper.readValue(request.getParameter(ServiceConstants.PARAMETER_KEY_DATA) , new TypeReference<List<ItemGrp>>() {});

        itemGrpService.deleteItemGroups(itemGroups);
        return new ResponseEntity<>(new ResponseMessage(HttpStatus.OK.value(), "Deleted itemGroup entities"), HttpStatus.OK);
    }

    @ExecPermission(type = ServiceConstants.PERMISSION_TYPE_UPDATE)
    @PostMapping("/itemgroups")
    public ResponseEntity<ResponseMessage> postItemGroups(HttpServletRequest request) throws JsonMappingException, JsonProcessingException {
        final List<ItemGrp> itemGroups = objectMapper.readValue(request.getParameter(ServiceConstants.PARAMETER_KEY_DATA) , new TypeReference<List<ItemGrp>>() {});

        itemGrpService.saveItemGroups(itemGroups);
        return new ResponseEntity<>(new ResponseMessage(HttpStatus.OK.value(), "Inserted or updated item entities"), HttpStatus.OK);
    }

    @ExecPermission(type = ServiceConstants.PERMISSION_TYPE_READ)
    @GetMapping("/inventories")
    public List<Inventory> getInventories(@RequestParam(value = "search", required = false) String search) throws UnsupportedEncodingException {
        if (search != null) {
            search = URLDecoder.decode(search, "UTF-8");
        }

        return inventoryService.getInventories(search);
    }

    @ExecPermission(type = ServiceConstants.PERMISSION_TYPE_DELETE)
    @PostMapping("/inventories/delete")
    public ResponseEntity<ResponseMessage> deleteInventories(HttpServletRequest request) throws JsonMappingException, JsonProcessingException {
        final List<Inventory> inventories = objectMapper.readValue(request.getParameter(ServiceConstants.PARAMETER_KEY_DATA) , new TypeReference<List<Inventory>>() {});

        inventoryService.deleteInventories(inventories);
        return new ResponseEntity<>(new ResponseMessage(HttpStatus.OK.value(), "Deleted item entities"), HttpStatus.OK);
    }

    @ExecPermission(type = ServiceConstants.PERMISSION_TYPE_UPDATE)
    @PostMapping("/inventories")
    public ResponseEntity<ResponseMessage> postInventories(HttpServletRequest request) throws JsonMappingException, JsonProcessingException {
        final List<Inventory> inventories = objectMapper.readValue(request.getParameter(ServiceConstants.PARAMETER_KEY_DATA) , new TypeReference<List<Inventory>>() {});

        inventoryService.saveInventories(inventories);
        return new ResponseEntity<>(new ResponseMessage(HttpStatus.OK.value(), "Inserted or updated item entities"), HttpStatus.OK);
    }

}
