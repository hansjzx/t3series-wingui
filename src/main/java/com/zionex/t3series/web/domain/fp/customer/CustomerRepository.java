package com.zionex.t3series.web.domain.fp.customer;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, String> {

    List<Customer> findByCustomerCdContainsOrCustomerNmContains(String customerCode, String customerName);
}
