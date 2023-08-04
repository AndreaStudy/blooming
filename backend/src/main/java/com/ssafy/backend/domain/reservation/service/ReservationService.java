package com.ssafy.backend.domain.reservation.service;

import com.ssafy.backend.domain.product.Product;
import com.ssafy.backend.domain.product.repository.ProductRepository;
import com.ssafy.backend.domain.reservation.Reservation;
import com.ssafy.backend.domain.reservation.dto.ReservationRegistDto;
import com.ssafy.backend.domain.reservation.dto.ReservationResultDto;
import com.ssafy.backend.domain.reservation.repository.ReservationRepository;
import com.ssafy.backend.domain.schedule.ScheduleType;
import com.ssafy.backend.domain.schedule.ScheduledBy;
import com.ssafy.backend.domain.schedule.dto.ReservationScheduleRegistDto;
import com.ssafy.backend.domain.schedule.dto.ScheduleRegistDto;
import com.ssafy.backend.domain.schedule.service.ScheduleService;
import com.ssafy.backend.domain.user.User;
import com.ssafy.backend.domain.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class ReservationService {

    private final ReservationRepository reservationRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final ScheduleService scheduleService;

    @Transactional
    public void registerReservation(ReservationRegistDto reservationRegistDto) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new IllegalArgumentException("JWT token: 회원 이메일에 해당하는 회원이 없습니다."));

        // 상품 객체 찾기
        Product product = productRepository.findById(reservationRegistDto.getProduct_id())
                .orElseThrow(() -> new IllegalArgumentException("아이디에 해당하는 상품이 없습니다."));

        //예약 객체 생성
        Reservation reservation = new Reservation(reservationRegistDto.getReservedDate(), reservationRegistDto.getReservedTime());
        reservation.setUser(user);
        reservation.setProduct(product);

        //객체 저장
        reservationRepository.save(reservation);

        //예약 시 스케줄 자동 등록
        //등록한 예약의 id 가져오기 : 그 1차캐시로.. 바로 되려나 아래처럼
        
        //스케줄 타입 결정
        ScheduleType scheduleType = null;
        switch(product.getProductType()){
            case 웨딩홀:
                scheduleType = ScheduleType.웨딩홀; break;
            case 스튜디오:
            case 드레스:
            case 메이크업:
                scheduleType = ScheduleType.스드메; break;
        }
        scheduleService.registReservationSchedule(new ReservationScheduleRegistDto(
                product.getItemName() + " 예약",
                product.getCompany() + " 에 방문해주세요",
                reservationRegistDto.getReservedDate(),
                reservationRegistDto.getReservedTime(),
                ScheduledBy.COMMON,
                scheduleType,
                reservation.getId()
        ));
    }

    public List<ReservationResultDto> getUserReservation() {
        //객체 찾기
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User findUser = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new IllegalArgumentException("이메일에 해당하는 유저가 없습니다."));

        List<Reservation> reservations = findUser.getReservations();
        return reservations.stream()
                .map(reservation -> new ReservationResultDto(
                        reservation.getId(),
                        reservation.getReservedDate(),
                        reservation.getReservedTime(),
                        reservation.getProduct().getId()
                ))
                .collect(Collectors.toList());
    }

    public void deleteReservation(Long reservationId) {
        reservationRepository.deleteById(reservationId);

        //예약 취소하면 일정도 삭제..
        scheduleService.deleteReservationSchedule(reservationId);
    }
}
