import React from 'react';
import { connect } from 'react-redux';
import MenuItem from 'material-ui/MenuItem';
import Moment from 'react-moment';
import 'moment/locale/de-ch';
import 'moment-timezone';
import {CSVLink} from 'react-csv';
import FlatButton from 'material-ui/FlatButton';
import Download from 'material-ui/svg-icons/file/cloud-download';

import {
    Table,
    TableBody,
    TableHeader,
    TableHeaderColumn,
    TableRow,
    TableRowColumn,
} from 'material-ui/Table';
import SelectField from 'material-ui/SelectField';
import { getNodes } from '../../actions/getNodes.jsx';
import { getNodeData } from '../../actions/getNodeData.jsx';

// tr key
var trkey = 0;

// Stylesheets
require('./data.scss');

class Data extends React.Component {

    constructor(props){
        super(props)
        this.state = {
            selectednode: null,
            selectedgateway: "all",
            selectednodegateways: [],
            messages: []
        }

        Moment.globalLocale = 'de-ch';

        // bindings
        this.handleNodeChange = this.handleNodeChange.bind(this);
        this.handleGatewayChange = this.handleGatewayChange.bind(this);
    }

    componentDidMount(){
        // get nodes data from API -> props.nodes
        this.props.dispatch(getNodes());
    }

    updateDataView(){
        var newMessages = [];
        this.props.uplinkmessages.map((uplinkmessage) => (
            uplinkmessage.gateways.map((gateway) => {
                // filter gateway
                if(gateway.gtw_id == this.state.selectedgateway || "all" == this.state.selectedgateway){
                    var newMessage = {
                        time: uplinkmessage.time,
                        counter:  uplinkmessage.counter,
                        latitude: uplinkmessage.latitude,
                        longitude: uplinkmessage.longitude,
                        buttonpressed: uplinkmessage.buttonpressed,
                        indangerzone: uplinkmessage.indangerzone,
                        snr: gateway.snr,
                        rssi: gateway.rssi,
                        gtw_id: gateway.gtw_id,
                        data_rate: uplinkmessage.data_rate,
                        coding_rate: uplinkmessage.coding_rate,
                        _id: uplinkmessage._id
                    }
                    newMessages.push(newMessage);
                }
            })
        ));
        this.setState({'messages': newMessages});
    }

    handleNodeChange(event, index, value){
        this.setState({'selectednode': value}, function() {
            // get the node data
            this.props.dispatch(getNodeData(this.state.selectednode._id)).then(data =>{
                this.updateDataView();
            });
        });
    }

    handleGatewayChange(event, index, value){
        this.setState({'selectedgateway': value}, function() {
            this.updateDataView();
        });
    }

    render(){
        return(
            <div id="data-container">
                <div id="controlbar">
                    <SelectField
                    className="selectnode"
                    floatingLabelText="Node-ID"
                    value={this.state.selectednode}
                    onChange={this.handleNodeChange}
                    >
                    {this.props.nodes
                        .map((node) => (
                            <MenuItem key={node.name} value={node} primaryText={node.name} />
                        ))
                    }
                    </SelectField>
                    {
                        this.state.selectednode &&
                        <SelectField
                            className="selectgateway"
                            floatingLabelText="Gateway"
                            value={this.state.selectedgateway}
                            onChange={this.handleGatewayChange}
                        >
                            <MenuItem key={"all"} value={"all"} primaryText={"All"}/>
                            {this.props.gateways
                                .map((gateway) => (
                                    <MenuItem key={gateway} value={gateway} primaryText={gateway}/>
                                ))
                            }
                        </SelectField>
                    }
                    {
                        this.props.uplinkmessages &&
                        <CSVLink id="downloadButton" data={this.state.messages} filename={"atasdata.csv"}>
                            <FlatButton
                                target="_blank"
                                label="Download"
                                primary={true}
                                icon={<Download />}
                            />
                        </CSVLink>
                    }
                </div>
                <Table id={"table-to-xls"}
                    className={"datatable"}>
                    <TableHeader
                        style={{
                            backgroundColor: "#fafafa"
                        }}
                        displaySelectAll={false}
                        adjustForCheckbox={false}>
                        <TableRow>
                            <TableHeaderColumn>Date</TableHeaderColumn>
                            <TableHeaderColumn>Time</TableHeaderColumn>
                            <TableHeaderColumn>Counter</TableHeaderColumn>
                            <TableHeaderColumn>Latitude</TableHeaderColumn>
                            <TableHeaderColumn>Longitude</TableHeaderColumn>
                            <TableHeaderColumn>Alert Triggered</TableHeaderColumn>
                            <TableHeaderColumn>In Dangerzone</TableHeaderColumn>
                            <TableHeaderColumn>RSSI</TableHeaderColumn>
                            <TableHeaderColumn>SNR</TableHeaderColumn>
                            <TableHeaderColumn>Gateway</TableHeaderColumn>
                            <TableHeaderColumn>DataRate</TableHeaderColumn>
                            <TableHeaderColumn>CodingRate</TableHeaderColumn>
                            <TableHeaderColumn>ID</TableHeaderColumn>
                        </TableRow>
                    </TableHeader>
                    {
                        this.state.messages &&
                        <TableBody displayRowCheckbox={false}>
                            {
                                this.state.messages
                                .map((message) => (
                                    <TableRow key={trkey++}>
                                        <TableRowColumn>
                                            <Moment format="DD.MM.YYYY" date={message.time}/>
                                        </TableRowColumn>
                                        <TableRowColumn>
                                            <Moment format="HH:mm" date={message.time}/>
                                        </TableRowColumn>
                                        <TableRowColumn>{message.counter}</TableRowColumn>
                                        <TableRowColumn>{message.latitude}</TableRowColumn>
                                        <TableRowColumn>{message.longitude}</TableRowColumn>
                                        <TableRowColumn>{
                                            message.buttonpressed != null &&
                                            <span>{message.buttonpressed.toString()}</span>
                                        }</TableRowColumn>
                                        <TableRowColumn>{
                                            message.indangerzone != null &&
                                            <span>{message.indangerzone.toString()}</span>
                                        }</TableRowColumn>
                                        <TableRowColumn>{message.rssi}</TableRowColumn>
                                        <TableRowColumn>{message.snr}</TableRowColumn>
                                        <TableRowColumn>{message.gtw_id}</TableRowColumn>
                                        <TableRowColumn>{message.data_rate}</TableRowColumn>
                                        <TableRowColumn>{message.coding_rate}</TableRowColumn>
                                        <TableRowColumn>{message._id}</TableRowColumn>
                                    </TableRow>
                                ))
                            }
                        </TableBody>
                    }
                </Table>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return{
        nodes: state.nodes,
        uplinkmessages: state.nodedata.uplinkmessages,
        gateways: state.nodedata.gateways
    };
}
export default connect(mapStateToProps)(Data);
