import React from 'react';
import { connect } from 'react-redux';
import MenuItem from 'material-ui/MenuItem';
import Moment from 'react-moment';
import 'moment/locale/de-ch';
import 'moment-timezone';
import {CSVLink, CSVDownload} from 'react-csv';
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
            selectedgatewayid: null,
            selectednodegateways: []
        }

        // bindings
        this.handleNodeChange = this.handleNodeChange.bind(this);
    }

    componentDidMount(){
        // get nodes data from API -> props.nodes
        this.props.dispatch(getNodes());
    }

    handleNodeChange(event, index, value){
        this.setState({'selectednode': value}, function() {
            // get the node data
            this.props.dispatch(getNodeData(this.state.selectednode._id));
        });
    }

    handleGatewayChange(event, index, value){
        this.setState({'selectedgatewayid': value}, function() {
        });
    }

    render(){
        Moment.globalLocale = 'de-ch';
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
                            value={this.state.selectedgatewayid}
                            onChange={this.handleGatewayChange}
                        >
                            {this.state.selectednodegateways
                                .map((gateway) => (
                                    <MenuItem key={gateway} value={gateway} primaryText={gateway}/>
                                ))
                            }
                        </SelectField>
                    }
                    {
                        this.props.nodedata &&
                            <CSVLink id="downloadButton" data={this.props.nodedata}>
                                <FlatButton
                                    target="_blank"
                                    label="Download"
                                    primary={true}
                                    icon={<Download />}
                                />
                            </CSVLink>
                    }
                </div>
                <Table
                    className={"datatable"}>
                    <TableHeader
                        style={{
                            backgroundColor: "#fafafa"
                        }}
                        displaySelectAll={false}
                        adjustForCheckbox={false}>
                        <TableRow>
                            <TableHeaderColumn>Counter</TableHeaderColumn>
                            <TableHeaderColumn>Latitude</TableHeaderColumn>
                            <TableHeaderColumn>Longitude</TableHeaderColumn>
                            <TableHeaderColumn>Alert Triggered</TableHeaderColumn>
                            <TableHeaderColumn>In Dangerzone</TableHeaderColumn>
                            <TableHeaderColumn>RSSI</TableHeaderColumn>
                            <TableHeaderColumn>SNR</TableHeaderColumn>
                            <TableHeaderColumn>Gateway</TableHeaderColumn>
                            <TableHeaderColumn>Date</TableHeaderColumn>
                            <TableHeaderColumn>Time</TableHeaderColumn>
                            <TableHeaderColumn>DataRate</TableHeaderColumn>
                            <TableHeaderColumn>CodingRate</TableHeaderColumn>
                            <TableHeaderColumn>ID</TableHeaderColumn>
                        </TableRow>
                    </TableHeader>
                    {
                        this.props.nodedata &&
                        <TableBody displayRowCheckbox={false}>
                            {
                                this.props.nodedata
                                .map((nodedata) => (
                                        nodedata.gateways
                                        .map((gateway) => (
                                            <TableRow key={trkey++}>
                                                <TableRowColumn>{nodedata.counter}</TableRowColumn>
                                                <TableRowColumn>{nodedata.latitude}</TableRowColumn>
                                                <TableRowColumn>{nodedata.longitude}</TableRowColumn>
                                                <TableRowColumn>{
                                                    nodedata.buttonpressed != null &&
                                                    <span>{nodedata.buttonpressed.toString()}</span>
                                                }</TableRowColumn>
                                                <TableRowColumn>{
                                                    nodedata.indangerzone != null &&
                                                    <span>{nodedata.indangerzone.toString()}</span>
                                                }</TableRowColumn>
                                                <TableRowColumn>{gateway.rssi}</TableRowColumn>
                                                <TableRowColumn>{gateway.snr}</TableRowColumn>
                                                <TableRowColumn>{gateway.gtw_id}</TableRowColumn>
                                                <TableRowColumn>
                                                    <Moment format="DD.MM.YYYY" date={nodedata.time}/>
                                                </TableRowColumn>
                                                <TableRowColumn>
                                                    <Moment format="HH:mm" date={nodedata.time}/>
                                                </TableRowColumn>
                                                <TableRowColumn>{nodedata.data_rate}</TableRowColumn>
                                                <TableRowColumn>{nodedata.coding_rate}</TableRowColumn>
                                                <TableRowColumn>{nodedata._id}</TableRowColumn>
                                            </TableRow>
                                        ))
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
        nodedata: state.nodedata
    };
}
export default connect(mapStateToProps)(Data);
