package com.ssafy.backend.domain.review;

import com.ssafy.backend.domain.common.CreatedAndUpdatedBaseEntity;
import com.ssafy.backend.domain.product.Product;
import com.ssafy.backend.domain.review.dto.ReviewModifyDto;
import com.ssafy.backend.domain.user.User;
import lombok.Getter;

import javax.persistence.*;

import static javax.persistence.FetchType.LAZY;

@Entity
@Getter
public class Review extends CreatedAndUpdatedBaseEntity {
    @Id
    @GeneratedValue
    @Column(name = "review_id")
    private Long id;

    private int star;
    private String image;
    private String content;
    private int likeCnt; //초기값 0

    //연관관계
    // 일단 단방향
    @ManyToOne(fetch = LAZY) //일단 해제
    @JoinColumn(name = "PRODUCT_ID")
    private Product product;

    // 일단 단방향
    @ManyToOne(fetch = LAZY)
    @JoinColumn(name = "USER_ID")
    private User user;

    public Review() {}

    //==연관관계 : 근데 단방향이니까..
    public void setProduct(Product product) {
        this.product = product;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Review(int star, String image, String content) {
        this.star = star;
        this.image = image;
        this.content = content;
    }

    public void update(ReviewModifyDto reviewModifyDto) {
        this.star = reviewModifyDto.getStar();
        this.image = reviewModifyDto.getImage();
        this.content = reviewModifyDto.getContent();
    }

    public void addCount() {
        this.likeCnt++;
    }

    public void subCount(){
        this.likeCnt--;

    }
}
