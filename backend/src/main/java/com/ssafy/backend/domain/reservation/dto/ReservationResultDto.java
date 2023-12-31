package com.ssafy.backend.domain.reservation.dto;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.datatype.jsr310.deser.LocalTimeDeserializer;
import com.fasterxml.jackson.datatype.jsr310.ser.LocalTimeSerializer;
import com.ssafy.backend.domain.product.ProductType;
import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDate;
import java.time.LocalTime;

@Getter
@AllArgsConstructor
public class ReservationResultDto {
    private Long reservationId;
    @DateTimeFormat(pattern = "yyyy-MM-dd")
    private LocalDate reservedDate;
    @DateTimeFormat(pattern = "kk:mm")
    private LocalTime reservedTime;
    private Long productId;
    private ProductType productType;
    private String thumbnail;
    private String company;
}
