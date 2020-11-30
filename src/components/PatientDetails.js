/*global FHIR*/

import React, { Component } from 'react';

class PatientDetails extends Component {

 constructor(props) {
    super(props);
    this.updateResults = this.updateResults.bind(this);
    this.state = {
      ready: false,
      api: false,
      resource: false,
    }
  }

  // sendData = () => {
  // //sendData(){
  //        this.props.parentCallback(this.state.patId);
  // }

  componentWillMount() {
    const self = this;
    FHIR.oauth2.ready(function(smart) {
      console.log("Oauth ready");
      console.log(smart);
      self.setState({ ready: true, api: smart });
      self.handleQuery(self.props, smart);
    });


    // const smart = new FHIR.client({
    //   serverUrl: "https://r4.smarthealthit.org",
    //   tokenResponse: {
    //       patient: "d070e7dd-4d25-4c52-9fb2-78d232e1cf2c"  //80a75b5a-fd30-4f38-895d-d8098fe7206e
    //   }
    // });
    // this.setState({ ready: true, api: smart });

  }

  componentWillUpdate(nextProps, nextState) {
    console.log("componentWillUpdate");
    if(this.props.query !== nextProps.query) {
      this.setState({ ready: false });
      this.handleQuery(nextProps, nextState.api);
    }
  }

  componentDidMount() {
    const props = this.props;
    this.handleQuery(props, this.state.api);
  }

  updateResults(results) {
    console.log("updateResults");
    console.log(results);
    const resource = results ? results : false;
    this.setState({ resource: resource, ready: true });
  }

  handleQuery(props, api) {
    console.log("handleQuery");
    const query = props.query;
    if(query) {
        var patient_id = "dbf9798e-4b52-4cd9-a9eb-ec36149c859a";
        if(api){
           patient_id =  api.patient.id;
           this.setState({ patId: patient_id });
           var queryData = "Patient/" + patient_id;
           api.request(queryData).then(this.updateResults);
        }
    }
    else {
      this.setState({
        ready: true
      })
    }
  }


  render() {
    console.log('Rendering patient details');

    if(this.state.ready) {
       const patient = this.state.resource;
       if(patient){
          var patientName = patient.name[0].given[0] +" "+patient.name[0].family;
          var patientGender = patient.gender;
          var patientDOB = patient.birthDate;

       }

      return (

        <div class="col-md-14 order-md-2 mb-4" >
        <h4 class="d-flex justify-content-between align-items-center mb-3">
          <span class="text-muted ">Patient Details</span>
        </h4>
        <ul class="list-group mb-3">
          <li class="list-group-item d-flex justify-content-between lh-condensed">
            <div>
              <h6 class="my-0">Full name</h6>
            </div>
            <span class="text-muted" id="patient_name">{patientName}</span>
          </li>
          <li class="list-group-item d-flex justify-content-between lh-condensed">
            <div>
              <h6 class="my-0">Gender</h6>
            </div>
            <span class="text-muted" id="gender">{patientGender}</span>
          </li>
          <li class="list-group-item d-flex justify-content-between lh-condensed">
            <div>
              <h6 class="my-0">DOB</h6>
            </div>
            <span class="text-muted" id="dob">{patientDOB}</span>
          </li>
        </ul>
        </div>




      );
    }
    else {
      return (
        <div>
          <h2>No Patient Data</h2>
        </div>
      );
      console.log("error");
    }
  }
}

export default PatientDetails;
