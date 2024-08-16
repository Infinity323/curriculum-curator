import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import './ResultsPage.css'
import './LandingPage.css'
import MUIDataTable from "mui-datatables";
import LoadSpinner from './LoadSpinner';
import { Rating } from '@mui/material';
import SearchBarResults from "./SearchBarResults";
import { useLocation } from "react-router-dom";
import {
    FormGroup,
    FormLabel,
    TextField,
  } from '@mui/material';
import { Checkmark } from 'react-checkmark';

function ResultsPage() {

    const [data, setData] = useState([]);

    function useQuery() {
        // Use the URLSearchParams API to extract the query parameters
        // useLocation().search will have the query parameters eg: ?foo=bar&a=b
        return new URLSearchParams(useLocation().search)
    }

    const query = useQuery()

    const question1 = query.get("question1")
    const question2 = query.get("question2")
    const question3 = query.get("question3")
    const question4 = query.get("question4")
    const question5 = query.get("question5")
    const question6 = query.get("question6")


    //getting API data

    const server_url = "https://currcurserver.herokuapp.com/results/" + encodeURIComponent(question1) 
                                                  + "/" + encodeURIComponent(question2)
                                                  + "/" + encodeURIComponent(question3)
                                                  + "/" + encodeURIComponent(question4)
                                                  + "/" + encodeURIComponent(question5)
                                                  + "/" + encodeURIComponent(question6);


    

    console.log(server_url);

    const fetchPlus = (url, retries) => {
        fetch(url)
            .then(response => response.json())
            .then(jsonArray => setData(jsonArray))
            .catch((error) => {
                console.error(error.message)
                fetchPlus(url, retries - 1)
            })
          
    }

    useEffect(() => {
        fetchPlus(server_url, 100);
    }, [])

const columns = [
    {
        name: "image",
        label: "\n",
        options: {
            customBodyRender: (image) => {
            return (
                <img className='course_img' src={image} alt="course"></img>
            )
            },
            filter: false,
            sort: false,
        }
    },
    {
        name: "name",
        label: "Name",
        options: {
        filter: false,
        sort: true,
        }
    },
    {
        name: "description",
        label: "Description",
        options: {
        filter: false,
        sort: true,
        }
    },
    {
        name: "website",
        label: "Website",
        options: {
        filter: true,
        filterType: "multiselect",
        sort: true,
        }
    },
    {
        name: "duration_info",
        label: "Duration",
        options: {
            filterOptions: {
                renderValue: val => {
                  if (val === "" || val === null || val === undefined) {
                    return "none";
                  }
                  return val;
                }
              },
            filter: true,
            filterType: "multiselect",
            sort: true,
        }
    },
    {
        name: "difficulty",
        label: "Experience",
        options: {
        filter: true,
        filterType: "multiselect",
        sort: true,
        }
    },
    {
        name: "star_rating",
        label: "Rating",
        options: {
        customBodyRender: (star_rating) => {
            return (
                <Rating precision="0.25" readOnly="true" value={star_rating}></Rating>
            )
            },
        filter: true,
        filterType: "dropdown",
        filterOptions: {
            names: ['1 Star', '2 Stars', '3 Stars', '4 Stars', '5 Stars'],
            logic(star_rating, star_filter) {
                const show =
                    (star_filter.indexOf('1 Star') >= 0 && star_rating >= 0) ||
                    (star_filter.indexOf('2 Stars') >= 0 && star_rating >= 2) ||
                    (star_filter.indexOf('3 Stars') >= 0 && star_rating >= 3) ||
                    (star_filter.indexOf('4 Stars') >= 0 && star_rating >= 4) ||
                    (star_filter.indexOf('5 Stars') >= 0 && star_rating >= 5);
                return !show;
            },
        },
        sort: true,
        }
    },
    {
        name: "num_ratings",
        label: "Popularity",
        options: {
        filter: false,
        sort: true,
        sortDirection: 'asc'
        }
    },
    {
        name: 'price',
        label: "Price",
        options: {
          filter: true,
          filterType: 'custom',
          
          customFilterListOptions: {
            render: v => {
              if (v[0] && v[1]) {
                return [`Min Price: ${v[0]}, Max Price: ${v[1]}`];
              } else if (v[0]) {
                return `Min Price: ${v[0]}`;
              } else if (v[1]) {
                return `Max Price: ${v[1]}`;
              }
              return [];
            },
            update: (filterList, filterPos, index) => {
              console.log('customFilterListOnDelete: ', filterList, filterPos, index);

              if (filterPos === 0) {
                filterList[index].splice(filterPos, 1, '');
              } else if (filterPos === 1) {
                filterList[index].splice(filterPos, 1);
              } else if (filterPos === -1) {
                filterList[index] = [];
              }

              return filterList;
            },
          },
          filterOptions: {
            names: [],
            logic(price, filters) {
              if (filters[0] && filters[1]) {
                return price < filters[0] || price > filters[1];
              } else if (filters[0]) {
                return price < filters[0];
              } else if (filters[1]) {
                return price > filters[1];
              }
              return false;
            },
            display: (filterList, onChange, index, column) => (
              <div>
                <FormLabel>Price</FormLabel>
                <FormGroup row>
                  <TextField
                    label='Minimum'
                    value={filterList[index][0] || ''}
                    onChange={event => {
                      filterList[index][0] = event.target.value;
                      onChange(filterList[index], index, column);
                    }}
                    style={{ width: '45%', marginRight: '5%' }}
                  />
                  <TextField
                    label='Maximum'
                    value={filterList[index][1] || ''}
                    onChange={event => {
                      filterList[index][1] = event.target.value;
                      onChange(filterList[index], index, column);
                    }}
                    style={{ width: '45%' }}
                  />
                </FormGroup>
              </div>
            ),
          },
          print: false,
        },
    },
    {
      name: "is_accredited",
      label: "CERTIFICATION",
      options: {
        customBodyRender: (credit) => {
          if (credit) {
            return (<Checkmark size='large' /> );
          } else {
            return (<p>None</p>)
          }
        },
        filterType: "dropdown",
        filterOptions: {
          names: ['Yes', 'No'],
          logic(credit, choice) {
              const show =
                  (choice.indexOf('Yes') >= 0 && credit) ||
                  (choice.indexOf('No') >= 0 && !credit);
              return !show;
          },
        },
        filter: true,
        sort: false,
      }
    },
    {
        name: "url",
        label: "\n",
        options: {
        customBodyRender: (url) => {
            return (
                <a target="_blank" href={url}>View here!</a>
            )
            },
        filter: false,
        sort: false,
        }
    },
];

const options = {
    filterType: "dropdown",
    selectableRows: "none",
    selectableRowsHeader: false,
    viewColumns: false,
    download: true
};

if (data.length === 0) {
    return(
        <div>
            <LoadSpinner />
        </div>
    )
} else if (data.at(0) === 'none') {
  console.log(data);
  return(
    <div>
        <br></br>
        <SearchBarResults/>
        <br></br>
        <h2>No course results. Please search again or return to quiz.</h2>
        <div class="bottom_button">
              <a href='http://localhost:3000/quiz'><button type="button" class="button">Try the quiz again!</button></a>
        </div>
    </div>
)
}

return(
    <div>
    <br></br>
        <SearchBarResults/>
        <h2>Coursera does not return course reviews.</h2>
    <br></br>
        <MUIDataTable
        title={"Course Results"}
        data={data}
        columns={columns}
        options={options}/>
</div>
)
}
 
export default ResultsPage;