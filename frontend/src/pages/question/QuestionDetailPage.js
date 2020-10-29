import React, { useState,useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import { useHistory } from "react-router-dom";

import './QuestionDetailPage.css';
import TextField from '@material-ui/core/TextField';
import Radio from '@material-ui/core/Radio';

const QuestionDetailPage = () => {
    const history = useHistory();
    const [ exam, setExam ] = useState('');
    const [ isExam, setIsExam ] = useState(false);
    const [cookies, setCookie] = useCookies(['accessToken']);
    const config = {
      headers: { 'Authorization':'Bearer '+ cookies.accessToken } 
    }
    const [ newQuest, setNewQuest  ] = useState('')
    const [ newAns, setNewAns ] = useState(-1)

    const onChangeNewQuest = (e) => {
        setNewQuest(e.target.value);
      }

    const addNewQuest = () => {
        if(!newQuest | newAns < 0) {
            alert('질문과 정답을 제대로 작성해주세요!')
        }else{
            const ExamData = {
              "contentList": [newQuest],
              "correctAnswerList": [newAns]
            }
            axios.post('/question/create', ExamData, config)
              .then(() => {
                  history.push('/question')
                  setNewQuest('')
                  setNewAns(-1)
              })
              .catch((error) => console.log(error))
        }
    }

    const onChangeAnsYes = (e) => {
        const {value} = e.target;
        setNewAns(1)
        console.log(newAns)
    }

    const onChangeAnsNo = (e) => {
        const {value} = e.target;
        setNewAns(0)
        console.log(newAns)
    }

    useEffect(() => {
        const fetchData = async() => {
          setIsExam(true);
          try {
            const getExam = await axios.get(`/question/list`,config);
            setExam(getExam.data)
            console.log(getExam.data,'??')
          } catch(e) {
            console.log(e);
          } 
          setIsExam(false);
        };
        fetchData();
      }, []);

      if(isExam){
        return <div>로딩중</div>
      }
    
      if(!exam){
        return null;
      }

    //시험지 전체 삭제
    const delExam = () => {
        axios.delete('/question', config)
        .then(() => {
            history.push('/question')
        })
        .catch((error) => console.log(error))
    }
            
  return (
    <div>
        {exam.map(item => (
            <div>
            <h4 key={item.questionId} item={item}>
                {item.content}</h4>
        </div>
        ))}
        <TextField
          id="outlined-full-width"
          label="문제"
          style={{ margin: 8 }}
          placeholder="추가 문제를 써주세요!"
          margin="normal"
          InputLabelProps={{
            shrink: true,
          }}
          variant="outlined"
          value={newQuest}
          onChange={onChangeNewQuest}
        />
        <div>
                      <Radio
                        checked={newAns===1}
                        onChange={onChangeAnsYes}
                        value="1"
                        name="radio-button-demo"
                        inputProps={{ 'aria-label': '예' }}
                      />예
                      <Radio
                        checked={newAns===0}
                        onChange={onChangeAnsNo}
                        value="0"
                        name="radio-button-demo"
                        inputProps={{ 'aria-label': '아니오' }}
                      />아니오
                    </div>
        <button onClick={addNewQuest}>추가</button>
        <br />
        <Link to="/question">
            <button className="exam-update-btn">취소</button>
        </Link>
        <button className="exam-delete-btn"
        onClick={delExam}>시험지 삭제</button>
    </div>
  );
  };
  
  export default QuestionDetailPage;