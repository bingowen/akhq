import React, { Component } from 'react';
import Table from '../../../../components/Table';
import { get } from '../../../../utils/api';
import { uriTopicsAcls } from '../../../../utils/endpoints';

class TopicAcls extends Component {
  state = {
    data: [],
    selectedCluster: ''
  };

  componentDidMount() {
    this.getAcls();
  }

  async getAcls() {
    let acls = [];
    const { clusterId, topicId } = this.props;

    acls = await get(uriTopicsAcls(clusterId, topicId));
    this.handleData(acls.data);
  }

  handleData(data) {
    let tableAcls = [];
    data.map(principal =>
      principal.acls.forEach((acl, index) => {
        tableAcls.push({
          id: index,
          topic: acl.resource.name || '',
          host: acl.host || '',
          permission: acl.operation || ''
        });
      })
    );
    this.setState({ data: tableAcls });
    return tableAcls;
  }

  render() {
    const { data } = this.state;
    return (
      <div>
        <Table
          columns={[
            {
              id: 'topic',
              accessor: 'topic',
              colName: 'Topic',
              type: 'text',
              sortable: true
            },
            {
              id: 'host',
              accessor: 'host',
              colName: 'Host',
              type: 'text',
              sortable: true
            },
            {
              id: 'permission',
              accessor: 'permission',
              colName: 'Permissions',
              type: 'text',
              cell: (obj, col) => {
                return (
                  <React.Fragment>
                    <span className="badge badge-secondary">
                      {obj[col.accessor].permissionType}
                    </span>{' '}
                    {obj[col.accessor].operation}
                  </React.Fragment>
                );
              }
            }
          ]}
          data={data}
          updateData={data => {
            this.setState({ data });
          }}
          noContent={
            <tr>
              <td colSpan={3}>
                <div className="alert alert-warning mb-0" role="alert">
                  No ACLS found, or the "authorizer.class.name" parameter is not configured on the
                  cluster.
                </div>
              </td>
            </tr>
          }
        />
      </div>
    );
  }
}

export default TopicAcls;
