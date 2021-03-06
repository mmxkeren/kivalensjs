'use strict'

import React from 'react'
import Reflux from 'reflux'
import {ListGroupItem} from 'react-bootstrap'
import {KivaImage} from '.'
import cx from 'classnames'
import a from '../actions'
import s from '../stores/'
import extend from 'extend'

const LoanListItem = React.createClass({
    mixins: [Reflux.ListenerMixin],
    getInitialState() {
        return extend(this.isInBasket(),{justLoaded:true,selected:s.loans.selected_id == this.props.id})
    },
    componentDidMount() {
        setTimeout(function(){
            this.setState({justLoaded:false})
        }.bind(this),50)

        this.listenTo(a.loans.selection, this.testSelection)
        this.listenTo(a.loans.basket.changed, this.basketChanged)
        this.listenTo(a.loans.live.loanNotFundraising, loan => {if (loan.id == this.props.id) this.loanUpdated(loan)})
        this.loanUpdated(this.props)
    },
    testSelection(id){
        var selected = this.props.id == id
        if (selected != this.state.selected)
            this.setState({selected})
    },
    basketChanged(){
        var st = this.isInBasket()
        if (st.inBasket != this.state.inBasket)
            this.setState(st)
    },
    isInBasket(){
        return { inBasket: s.loans.syncInBasket(this.props.id) }
    },
    loanUpdated(loan){
        if (loan.status != 'fundraising')
            this.setState({loanNotFundraising: true})
    },
    render() {
        var loan = this.props
        let {selected} = this.state
        return <ListGroupItem
                onDoubleClick={a.loans.basket.add.bind(this, loan.id, 25)}
                className={cx('loan_list_item', {selected, gone: this.state.justLoaded, in_basket: this.state.inBasket, funded: this.state.loanNotFundraising})}
                key={loan.id}
                href={`#/search/loan/${loan.id}`}>
                <KivaImage key={loan.id} type="square" loan={loan} image_width={113} height={90} width={90}/>
                <div className="details">
                    <p><b>{loan.name}</b></p>
                    {loan.location.country} | {loan.sector} <span className="hidden-md">| {loan.activity}</span>
                    <p className="hidden-md">
                    {loan.use}
                    </p>
                </div>
            </ListGroupItem>
    }
})

export default LoanListItem