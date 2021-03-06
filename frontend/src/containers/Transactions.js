import React, { Component } from 'react';

import { connect } from 'react-redux';
import values from 'lodash/object/values';
import sortBy from 'lodash/collection/sortBy';

import Currency from '../components/Currency';
import DisplayUrl from '../components/DisplayUrl';
import Icon from '../components/Icon';
import PublicFooter from '../components/PublicFooter';
import PublicTopBar from '../containers/PublicTopBar';
import SubmitExpense from '../containers/SubmitExpense';

import TransactionItem from '../components/TransactionItem';

import fetchUsers from '../actions/users/fetch_by_group';
import fetchTransactions from '../actions/transactions/fetch_by_group';
import decodeJWT from '../actions/session/decode_jwt';
import Button from '../components/Button';

export class Transactions extends Component {

  constructor(props) {
    super(props);
    this.state = {showSubmitExpense: props.router.location.pathname.match(/new$/) };
  };

  toggleAddExpense() {
    this.setState({ showSubmitExpense: !this.state.showSubmitExpense });
  };

  render() {
    const {
      group,
      transactions,
      users,
      type
    } = this.props;

    const showSubmitExpense = this.state.showSubmitExpense;

    return (
     <div className='Transactions'>

        <PublicTopBar />

        <div className='PublicContent'>
          <div className='Widget-header'>

            <div className='PublicGroupHeader'>
              <img className='PublicGroupHeader-logo' src={group.logo ? group.logo : '/static/images/media-placeholder.svg'} />
              <div className='PublicGroupHeader-website'><DisplayUrl url={group.website} /></div>
              <div className='PublicGroupHeader-description'>
                {group.description}
              </div>
            </div>

            <div className='Widget-balance'>
              <Currency
                value={group.balance/100}
                currency={group.currency}
                precision={2} />
            </div>
            <div className='Widget-label'>Available funds</div>
          </div>

          {showSubmitExpense && (<SubmitExpense onCancel={this.toggleAddExpense.bind(this)} />)}

          {type === 'expense' && !showSubmitExpense && (<Button onClick={this.toggleAddExpense.bind(this)} label="Submit Expense" id="submitExpenseBtn" />)}
          <h2>All {type}s</h2>

          <div className='PublicGroup-transactions'>
            {(transactions.length === 0) && (
              <div className='PublicGroup-emptyState'>
                <div className='PublicGroup-expenseIcon'>
                  <Icon type='expense' />
                </div>
                <label>
                  All {type}s will show up here
                </label>
              </div>
            )}
            {transactions.map(tx => <TransactionItem
                                       key={tx.id}
                                       transaction={tx}
                                       user={users[tx.UserId]}
                                       precision={2}
                                       />)}
          </div>
        </div>
        <PublicFooter />
      </div>
    );
  }

  componentWillMount() {
    const {
      group,
      fetchTransactions,
      fetchUsers,
      type
    } = this.props;

    const options = {
      sort: 'createdAt',
      direction: 'desc',
      [type]: true
    };

    fetchTransactions(group.id, options);

    fetchUsers(group.id);
  }

  componentDidMount() {
    // decode here because we don't handle auth on the server side yet
    this.props.decodeJWT();
  }
}

export default connect(mapStateToProps, {
  fetchTransactions,
  fetchUsers,
  decodeJWT
})(Transactions);

function mapStateToProps({
  session,
  groups,
  transactions,
  users,
  router
}) {
  const type = (router.params.type) ? router.params.type.slice(0,-1) : "expense"; // remove trailing s for the API call
  const group = values(groups)[0] || {}; // to refactor to allow only one group
  const list = (type === 'donation') ? transactions.isDonation : transactions.isExpense;

  return {
    session,
    group,
    transactions: sortBy(list, txn => txn.incurredAt || txn.createdAt).reverse(),
    router,
    users,
    type
  };
}
