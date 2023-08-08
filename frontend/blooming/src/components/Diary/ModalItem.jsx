import { useParams, useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import { diaryState } from '../../recoil/DiaryStateAtom';
import DatePicker from 'react-datepicker'
import './DatePicker.css'
import classes from './ModalItem.module.css'
import { customAxios } from "../../lib/axios";

function CreateItem({ hide, item }) {
  const [diaries, setDiaries] = useRecoilState(diaryState)
  const [date, setDate] = useState(new Date());
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  // const [image, setImage] = useState('');
  
  // URL 정의 
  const [URLThumbnail, setURLThumbnail] = useState({url:''});

  const [isEditMode, setIsEditMode] = useState(false)
  
  useEffect(() => {
    if (item) {
      setDate(new Date(item.date))
      setTitle(item.title)
      setContent(item.content)
      setURLThumbnail({url: item.image})
      setIsEditMode(true)
    }
  }, [item])

  function dateChangeHandler(date) {
    setDate(date);
  }

  function titleChangeHandler(event) {
    setTitle(event.target.value)
  }

  function contentChangeHandler(event) {
    setContent(event.target.value);
  }

  // function imageChangeHandler(event) {
  //   const file = event.target.files[0];
  //   if (!file) {
  //     setImage('');
  //     return;
  //   }
  //   const reader = new FileReader();
  //   reader.onload = (e) => {
  //     setImage(e.target.result);
  //   };
  //   reader.readAsDataURL(file);
  // }

  // ----------FileReader 사용 대신 URL 객체 사용-----------
  function imageChangeHandler(event) {
    const file = event.target.files[0];
    if(!file) {
      setURLThumbnail(null);
      return;
    }
    setURLThumbnail(URL.createObjectURL(file));
  }

  const ItemData = {
    title: title,
    content: content,
    date: `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`,
    image: URLThumbnail.url
  };

  function submitHandler(event) {
    event.preventDefault();
    
    if (!isEditMode) {
      const createDiary = async () => {
        try {
          const response = await customAxios.post("diary", ItemData);
          const customItemData = {
            id: response.data.result[0],
            title: ItemData.title,
            content: ItemData.content,
            date: ItemData.date,
            image: ItemData.image
          }
          setDiaries((existingData) => [customItemData, ...existingData]); // 아이템 만들기
        } catch (error) {
          console.error(error);
        }
      };
      createDiary();
      
    } else {
      const updateDiary = async () => {
        try {
          const customItemData = {
            id: Number(item.id),
            title: title,
            content: content,
            date: `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`,
            image: image,
          }
          await customAxios.put("diary", customItemData);
          setDiaries(diaries.map((diary) => {
            if (diary.id === Number(item.id)) {
              return customItemData
            }
            return diary
          }));
        } catch (error) {
          console.error(error);
        }
      };
      updateDiary();
    }
    hide();
  }

  return (
    <div>
        <form className={classes.form} onSubmit={submitHandler}>
        {/* 버튼 사이 날짜 선택 자리 */}
        <div className={classes.actions}>
          <button type='button' onClick={hide}>취소</button>

          <div className={classes.datePickerContainer}>
              <DatePicker
                  showPopperArrow={false}
                  id="date"
                  selected={date}
                  onChange={dateChangeHandler}
                  dateFormat="yyyy-MM-dd"
                  required
              />
          </div>

          {item ? <button name='action' value='edit' type="submit">수정</button>
            : <button name='action' value='add' type="submit">추가</button>}
        </div>
          


        {/* 사진 등록 자리 */}
        <div className={classes.imageContainer}>
          <label className={classes.label} htmlFor="image">+</label>
          <input
            className={classes.img}
            type="file"
            id="image"
            accept="image/*"
            onChange={imageChangeHandler}
          />
          {URLThumbnail && (
            <img
              src={URLThumbnail}
              alt="preview"
            />
          )}
        </div>


        
        {/* 일정 타이틀 및 내용 자리 */}
        <div className={classes.text}>
          <textarea className={classes.title} id="title" value={title} required rows={1} 
          onChange={titleChangeHandler} placeholder='기념일을 입력하세요' />

          <hr/>  

          <textarea className={classes.context} id="body" value={content} required rows={50}
          onChange={contentChangeHandler} placeholder='상대방에게 전달하고 싶은 내용을 적어주세요.' />
        </div>
        
      </form>
    </div>
    
  );
}

export default CreateItem;
