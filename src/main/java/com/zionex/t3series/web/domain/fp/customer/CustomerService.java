package com.zionex.t3series.web.domain.fp.customer;

import java.util.List;

import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CustomerService {

    private final CustomerRepository customerRepository;

    public List<Customer> getCustomers() {
        return customerRepository.findAll();
    }

    public boolean saveCustomers(List<Customer> customers) {
        try {
            customerRepository.saveAll(customers);
            return true;
        } catch (Exception ignored) {
        }
        return false;
    }

    public boolean deleteCustomers(List<Customer> customers) {
        try {
            customerRepository.deleteAll(customers);
            return true;
        } catch (Exception ignored) {
        }
        return false;
    }

}
