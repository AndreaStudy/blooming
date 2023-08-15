import { useNavigate, useParams } from 'react-router-dom';
import classes from './TaskDetail.module.css';
import { useEffect, useState } from 'react';
import { customAxios } from '../../lib/axios';
import { AiOutlineLeft } from "react-icons/ai"
import { AiOutlineCheck } from "react-icons/ai"
import { PiPencilLineFill } from 'react-icons/pi'
import { BsTrash , BsCalendarCheck, BsClock, BsReverseLayoutTextSidebarReverse } from 'react-icons/bs'
import { ko } from "date-fns/esm/locale";


function TaskDetail() {
  const task = {
    "id": 23160,
    "title": "희영이랑 만나기",
    "content": "희영이랑 만나기의 내용",
    "scheduleDate": "2023-08-15",
    "scheduleTime": "16:20:00",
    "scheduledBy": "FEMALE",
    "scheduleType": "PRI"
    }
  const formattedTime = task.scheduleTime.slice(0, 5);
  const { id } = useParams();
  // const [task, setTask] = useState();

  const navigate = useNavigate();

  const handleHistory = () => {
    navigate("/schedule");
  };

  const handleUpdate = () => {
    navigate(`/schedule/new-task`, {
      state: { task: task },
    });
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await customAxios.get(`schedule/${id}`);
        
        if (response.status === 200) {
          setTask(response.data.result[0]);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  return (
    <>
      {task &&
        <div className={classes.details}>

          {/* ---------버튼 부분-------- */}   
          <div className={classes.actions}>
          <button onClick={handleHistory}><AiOutlineLeft /></button>
          <button onClick={handleUpdate}><PiPencilLineFill/></button>
          </div>


          {/* ---------제목 입력 부분-------- */}
          <div className={classes.mainTitle}>
            <div className={classes.title}>{task.title}</div>
          </div>


            {/* ---------날짜 선택 부분-------- */}
          <div className={`${classes.date} schedule`}>
            <BsCalendarCheck className={classes.icon} size={24}/>
            <div className={classes.date1}>{task.scheduleDate}</div>
          </div>

            {/* ---------시간 선택 부분-------- */}
          <div className={`${classes.time} schedule`}>
            <BsClock size={24} className={classes.icon}/>
            <div className={classes.time1}>{formattedTime}</div>
          </div>

          {/* ---------내용 입력 부분-------- */}
          <div className={classes.mainContent}>
            <BsReverseLayoutTextSidebarReverse size={24} />
            <div className={classes.content}>{task.content}</div>
          </div>
        </div>
        
      }
    </>
  );
}

export default TaskDetail;