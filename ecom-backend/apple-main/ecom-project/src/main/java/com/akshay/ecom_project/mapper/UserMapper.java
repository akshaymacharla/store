package com.akshay.ecom_project.mapper;

import com.akshay.ecom_project.dto.UserDTO;
import com.akshay.ecom_project.model.User;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface UserMapper {
    UserMapper INSTANCE = Mappers.getMapper(UserMapper.class);

    UserDTO toDTO(User user);
    
    // Explicitly mapping mapping DTO -> Entity, ignore password securely in DTO logic normally
    User toEntity(UserDTO userDTO); 
}
