package com.akshay.ecom_project.mapper;

import com.akshay.ecom_project.dto.ProductDTO;
import com.akshay.ecom_project.model.Product;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface ProductMapper {
    ProductMapper INSTANCE = Mappers.getMapper(ProductMapper.class);

    @Mapping(target = "imageUrl", expression = "java(\"/api/product/\" + product.getId() + \"/image\")")
    @Mapping(source = "category.name", target = "category")
    ProductDTO toDTO(Product product);

    @Mapping(target = "category", ignore = true)
    @Mapping(target = "imageData", ignore = true)
    @Mapping(target = "imageName", ignore = true)
    @Mapping(target = "imageType", ignore = true)
    Product toEntity(ProductDTO productDTO);
}
