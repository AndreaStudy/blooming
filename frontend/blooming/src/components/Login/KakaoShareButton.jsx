import { useEffect } from "react";
import { styled } from "styled-components";

const KakaoShareButton = ({ code }) => {
  const url = import.meta.env.VITE_LOGIN_URL;
  const api_key = import.meta.env.VITE_KAKAO_API_KEY;

  useEffect(() => {
    const createKakaoButton = () => {
      if (window.Kakao) {
        // 카카오 스크립트가 로드된 경우 init
        const kakao = window.Kakao;
        if (!kakao.isInitialized()) {
          kakao.init(api_key);
        }
        kakao.Link.createDefaultButton({
          container: "#kakao-link-btn",
          objectType: "feed",
          content: {
            title: "블루밍, 당신만을 위한 모바일 웨딩 플래너",
            description: `약혼자와 연결하기 초대코드 ${code}`,
            imageUrl:
              "https://blooming-image-bucket.s3.ap-northeast-2.amazonaws.com/product/hall/85_thumbnail.jpg",
            link: {
              mobileWebUrl: url,
              webUrl: url,
            },
          },
          buttons: [
            {
              title: "웹으로 이동",
              link: {
                mobileWebUrl: url,
                webUrl: url,
              },
            },
          ],
        });
      }
    };
    createKakaoButton();
  }, [code]);

  return (
    <KakaoBtn id='kakao-link-btn' type='button'>
      <img src='/src/assets/kakaoshare.png' alt='카카오톡으로 공유하기' />
    </KakaoBtn>
  );
};

export default KakaoShareButton;

const KakaoBtn = styled.button`
  border: none;
  border-radius: 10px;
  margin: 0 auto;
  width: 60vw;
  height: calc(60vw * 193 / 1080); // img 비율이 1080:193이라서
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  position: relative;

  img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;
