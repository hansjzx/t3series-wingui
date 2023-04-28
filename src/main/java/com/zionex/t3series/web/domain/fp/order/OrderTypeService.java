package com.zionex.t3series.web.domain.fp.order;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderTypeService {

    private final OrderTypeRepository orderTypeRepository;

    private static final List<String> basicOrderTypeCode = new ArrayList<String>(Arrays.asList("URGENCY", "NORMAL", "FORECAST"));

    public List<OrderType> getOrderTypes() {
        List<OrderType> orderTypes = orderTypeRepository.findAll();

        for (OrderType orderType : orderTypes) {
            if (basicOrderTypeCode.contains(orderType.getOrderTpCd())) {
               orderType.setIsDeletable(false);
            } else {
                orderType.setIsDeletable(true);
            }
        }

            return orderTypes;
    }

    public List<OrderType> getOrderTypes(String param) {
        param = param == null ? "" : param;

        List<OrderType> orderTypes = orderTypeRepository.findByOrderTpCdContains(param);

        for (OrderType orderType : orderTypes) {
            if (basicOrderTypeCode.contains(orderType.getOrderTpCd())) {
                orderType.setIsDeletable(false);
            } else {
                orderType.setIsDeletable(true);
            }
        }

        return orderTypes;
    }

    public boolean saveOrderTypes(List<OrderType> orderTypes) {
        try {
            for (OrderType orderType : orderTypes) {
               if (orderType.getCancOnShtgYn() == null) {
                   orderType.setCancOnShtgYn(true);
               }
            }

            orderTypeRepository.saveAll(orderTypes);
            return true;
        } catch (Exception ignored) {
        }
        return false;
    }

    public boolean deleteOrderTypes(List<OrderType> orderTypes) {
        try {
            orderTypeRepository.deleteAll(orderTypes);
            return true;
        } catch (Exception ignored) {
        }
        return false;
    }

}
