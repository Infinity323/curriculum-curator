import React, {  } from 'react';
import './App.css';
import './ResultsPage.css'

 
function SingleCourse(name, website, description, url, image, is_paid, price, duration_hours, duration_range, difficulty, star_rating, num_ratings) {

  return (
    <table>
      <tbody>
        <tr>
          <td>
            <h5>{name}</h5>
          </td>
          <td>
            <h5>{website}</h5>
          </td>
          <td>
            <h4>{description}</h4>
          </td>
          <td>
            <p>{url}</p>
          </td>
        </tr>
      </tbody>
    </table>
  );
}
 
export default SingleCourse;