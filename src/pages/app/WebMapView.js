import React from 'react';
import ArcGIS from '../../ArcGIS/ArcGIS';
import './style.css'

const arcGIS = new ArcGIS();

 class WebMapView extends React.Component {
  
    constructor(props) {
        super(props);
        this.mapRef = React.createRef();
        this.token = null
    }    
     componentWillMount() {
        arcGIS.loader();
     
     }

    componentWillUnmount() {
        if (this.view) {
            this.view.container = null;
        }
    }

    render() {
        return (
              
              <div className="webmap" ref={this.mapRef} id="viewDiv" />
                
        )
            
    }
}
export default WebMapView;