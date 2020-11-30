/*global FHIR*/

import React, { Component } from 'react';
import axios from 'axios';

class Immunizations extends Component {

 constructor(props) {
    super(props);
    this.state = {
      ready: false,
      patientData: this.props.dataFromParent,
      immune_events: [
        //State is updated via componentDidMount
        'rubella','HTB'
      ],
    }
  }

  componentWillMount() {
    const self = this;
    FHIR.oauth2.ready(function(smart) {
      console.log("Oauth ready Immune");
      console.log(smart);
      self.setState({patientData: smart.patient.id});
      self.executeImAPI(smart.patient.id);
    });
  }

  executeImAPI(im_pat_id){
    const config = {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS"
        }
      };
    var pat_id = im_pat_id;

    // if(!pat_id){
    //   pat_id="d070e7dd-4d25-4c52-9fb2-78d232e1cf2c";
    // }
    var url = "https://immune-tracker-api.herokuapp.com/vaccines/patient/" + pat_id;
    axios.get(url,config)
      .then(response => {
        console.log(response.data);
        let immunizationData = response.data;

        this.setState({
          ready: true,
          immune_events:immunizationData
        })

        console.log(this.state.immune_events)

      })
      .catch(function (error) {
        console.log(error);
      });

  }

  componentDidMount() {


  }



  render() {

    if(this.state.ready) {
      const items = []
      const divStyle = {
        height: '25px'
      };

        for (let i = 0; i < this.state.immune_events.length; i++) {

          items.push(<li class="list-group-item">
            <span class="text-muted small" id="vaccine_name">{this.state.immune_events[i].vaccineName}</span>
            <br/>
            <span class="text-muted small" id="vaccine_date">{this.state.immune_events[i].vaccineDate}</span>
          </li>)

        }

      return (
        <div class="Container h-100 overflow-auto">
        <div class="card-header">
          <h4 class="my-0 font-weight-normal">Vaccines so far</h4>
        </div>
        <div style={divStyle} >
        <ul class="list-group mb-3">
          {items}
        </ul>
        </div>
        </div>
      );
    } else {
      return (
      <div class="card-header">
        <h4 class="my-0 font-weight-normal">No Vaccines so far</h4>
      </div>
      );

    }
  }
}

export default Immunizations;
