package com.akshay.ecom_project.repo;

import com.akshay.ecom_project.model.Category;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoryRepo extends JpaRepository<Category, Long> {
}
