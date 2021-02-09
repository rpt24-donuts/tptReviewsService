/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/prop-types */
import React from 'react';
import styled from 'styled-components';
import Ratings from './ratings.jsx';

// const StyledUser = styled.div`
//   font-size: 16px;
// `;

// const StyledTitle = styled.div`
//   font-size: 16px;
//   font-weight: bold;
// `;

function Review(props) {
  return (
    <div className="reviewContainer">
      <div className="avatar">
        <span>
          <img className="avatar_img" src="https://ecdn1.teacherspayteachers.com/images/avatars/default.jpg" />
        </span>
        <div className="avatar_namedate">
          <p className="avatar_namedate_name">{props.review.username.split(' ')[0] + ' ' + props.review.username.split(' ')[1][0] + '.'}</p>
          <p className="avatar_namedate_date"> <span>October 25th, 2020</span></p>
        </div>
      </div>
      <div className="rating">
        <Ratings rating={props.review.rating} />
        <b>
          {(function () {
            let satisfaction = '';
            switch (props.review.rating) {
              case 1:
                satisfaction = 'Not Satisfied';
                break;
              case 2:
                satisfaction = 'Barely Satisfied';
                break;
              case 3:
                satisfaction = 'Somewhat Satisfied';
                break;
              case 4:
                satisfaction = 'Very Satisified';
                break;
              case 5:
                satisfaction = 'Extremely Satisfied';
                break;
              default:
                satisfaction = '';
            }
            return satisfaction;
          }())}
        </b>
      </div>
      <div>{props.review.description}</div>
      <br />
      <div className="gradesUsed">
        <div className="gradesUsedTitle">Students used with</div>
        <div className="gradesUsedNames"><b>{props.review.grade.join(', ')}</b></div>
      </div>
      <br />
      <div className="alignmentContainer">
        <div> Alignment to standards</div>
        {props.review.standards.map((item) => (
          <div>
            <div>{item.standard}</div>
            <div className="alignment">
              <div className="alignmentBar" style={{ width: `${String(100 * (item.alignment / 5))}%` }}>|</div>
            </div>
          </div>
        ))}
      </div>
      <br />
      <div
        className="fa fa-thumbs-up"
        onClick={() => {
          props.helpful(props.review._id);
        }}
      >
        {props.review.helpful}
        {' '}
        Helpful
      </div>
    </div>
  );
}

export default Review;
