/*global FHIR*/
import React, { Component,  useState, useRef } from 'react';
import ReactDOM,{ render } from "react-dom";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import axios from 'axios';
import "react-big-calendar/lib/css/react-big-calendar.css";
import './App.css';
import PatientDetails from './components/PatientDetails.js'
import Immunizations from './components/Immunizations.js'
import { Overlay, Tooltip, Container, Row, Col } from "react-bootstrap";
import events from './components/events.js'




moment.locale('en-US');
const localizer = momentLocalizer(moment);
const myEventsList = {} //empty object for now


class App extends Component {

  constructor(props) {
    super(props)

    this.state = {
        patId: "",
        cal_events: [
        //State is updated via componentDidMount
        'rubella','HTB'
      ],
    }

  }

  convertDate = (date) => {
    return moment.utc(date).toDate()
  }

  componentWillMount() {
    const self = this;
    FHIR.oauth2.ready(function(smart) {
      console.log("Oauth ready");
      console.log(smart);
      self.setState({ patId: smart.patient.id });
      self.executeapi(smart.patient.id);
    });
  }


  executeapi(sel_pat_id){

    const config = {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS"
        }
      };

      var pat_id = sel_pat_id;


      // if(!pat_id){
      //   pat_id="d070e7dd-4d25-4c52-9fb2-78d232e1cf2c";
      // }
      var url = "http://localhost:8080/vaccines/calendar_events/" + pat_id;
      console.log(url);
    axios.get(url,config)
      .then(response => {
        console.log(response.data);
        let appointments = response.data;

        for (let i = 0; i < appointments.length; i++) {

          appointments[i].start = this.convertDate(appointments[i].start)
          appointments[i].end = this.convertDate(appointments[i].end)

        }

        this.setState({
          cal_events:appointments
        })

      })
      .catch(function (error) {
        console.log(error);
      });
  }

  // componentDidMount() {
  //   this.executeapi();
  // }


  render() {

    const { cal_events } = this.state
    console.log("patid in app",this.state.patId);
    return (
      <Container className="p-8">
      <div class="py-5 text-center">
        <h2>Kids Immunization Tracker(0-6 Years)</h2>
        <p class="lead">Kids Immunization Tracker will help parents to track what vaccines are due, what is upcoming and what has already been given.</p>
      </div>
      <Row>
      <Col>
      <PatientDetails  query={{ type: 'Patient', id: '37e97ea5-e2dc-4770-bb7d-93d02cfebb0c'}} >
      </PatientDetails >
      <Immunizations dataFromParent={this.state.patId}></Immunizations>
      </Col>
      <Col>
        <Calendar
            tooltipAccessor= { (event) => {
                console.log(event);
                return event.description;
              }
            }
            localizer={localizer}
            events={cal_events}
            step={30}
               defaultView='month'
                 views={['month','week','day']}
            startAccessor="start"
            endAccessor="end"
            eventPropGetter={
                (event, start, end, isSelected) => {
                  console.log(event);
                  let newStyle = {
                    backgroundColor: event.color,
                    color: 'black'
                  };

                  return {
                    className: "",
                    style: newStyle
                  };
                }
              }
            style={{ height: 500 , width: 800}}
            />
      </Col>
      </Row>
    </Container>
    );
  }
}

export default App;
