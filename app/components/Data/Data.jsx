import React from 'react';
import { connect } from 'react-redux';
import MenuItem from 'material-ui/MenuItem';
import Moment from 'react-moment';
import 'moment/locale/de-ch';
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

// Stylesheets
require('./data.scss');

class Data extends React.Component {

    constructor(props){
        super(props)
        this.state = {
            selectednode: null,
            selectednodeid: null
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
            console.log(this.state.nodedata);
        });
    }

    render(){
        Moment.globalLocale = 'de-ch';
        return(
            <div id="data-container">
                <div>
                    <SelectField
                    className="selectfield"
                    floatingLabelText="Node-ID"
                    value={this.state.selectednode}
                    onChange={this.handleNodeChange}
                    id="selectfield"
                    >
                    {this.props.nodes
                        .map((node) => (
                            <MenuItem key={node.name} value={node} primaryText={node.name} />
                        ))
                    }
                    </SelectField>
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
                            <TableHeaderColumn>Latitude</TableHeaderColumn>
                            <TableHeaderColumn>Longitude</TableHeaderColumn>
                            <TableHeaderColumn>Alert Button Pressed</TableHeaderColumn>
                            <TableHeaderColumn>RSSI</TableHeaderColumn>
                            <TableHeaderColumn>SNR</TableHeaderColumn>
                            <TableHeaderColumn>Date</TableHeaderColumn>
                            <TableHeaderColumn>Time</TableHeaderColumn>
                            <TableHeaderColumn>ID</TableHeaderColumn>
                        </TableRow>
                    </TableHeader>
                    {
                        this.props.nodedata &&
                        <TableBody displayRowCheckbox={false}>
                            {this.props.nodedata
                                .map((nodedata) => (
                                    <TableRow key={nodedata._id}>
                                        <TableRowColumn>{nodedata.latitude}</TableRowColumn>
                                        <TableRowColumn>{nodedata.longitude}</TableRowColumn>
                                        <TableRowColumn>{nodedata.buttonpressed}</TableRowColumn>
                                        <TableRowColumn>{nodedata.rssi}</TableRowColumn>
                                        <TableRowColumn>{nodedata.snr}</TableRowColumn>
                                        <TableRowColumn>
                                            <Moment parse="YYYY-MM-DD">{nodedata.time}</Moment>
                                        </TableRowColumn>
                                        <TableRowColumn>
                                            <Moment parse="HH:mm">{nodedata.time}</Moment>
                                        </TableRowColumn>
                                        <TableRowColumn>{nodedata._id}</TableRowColumn>
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
        nodedata: state.nodedata.data
    };
}
export default connect(mapStateToProps)(Data);
