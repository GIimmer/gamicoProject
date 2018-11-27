import React from 'react';
import { withRouter } from "react-router-dom";

class Error extends React.Component{
    componentDidMount(){
        this.props.history.push('/');
    }
    render(){
        return (
            <h1>Error</h1>
        );
    }
}
export default withRouter(Error);