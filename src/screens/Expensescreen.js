import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

function Homescreen() {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    const [transactions, setTransactions] = useState([]);
    const [sortedTransactions, setSortedTransactions] = useState([]);
    const [sortCriteria, setSortCriteria] = useState('date'); // default sort by date
    const [sortOrder, setSortOrder] = useState('asc'); // 'asc' or 'desc'
    const [filteredCategory, setFilteredCategory] = useState('all'); // New state for category 
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 10;


    const [incomeTransactions, setIncomeTransactions] = useState([]);
    const [expenseTransactions, setExpenseTransactions] = useState([]);
    const [totalIncome, setTotalIncome] = useState(0);
    const [totalExpense, setTotalExpense] = useState(0);
    const [moneyLeft, setMoneyLeft] = useState(0);
    const [categoryData, setCategoryData] = useState([]);
    const [isFormVisible, setIsFormVisible] = useState(false);

    const [type, setType] = useState('expense');
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [date, setDate] = useState('');

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#FF6384'];

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('/api/transaction/getusertransactions', {
                    params: { userid: user._id },
                });
                const data = response.data;
                setTransactions(data);

                const currentDate = new Date();
                const currentMonth = currentDate.getMonth();
                const currentYear = currentDate.getFullYear();

                const currentMonthTransactions = data.filter(transaction => {
                    const transactionDate = new Date(transaction.date);
                    return (
                        transactionDate.getMonth() === currentMonth &&
                        transactionDate.getFullYear() === currentYear
                    );
                });

                setTransactions(currentMonthTransactions);

                const filteredIncome = currentMonthTransactions.filter(transaction => transaction.type === 'income');
                setIncomeTransactions(filteredIncome);

                const filteredExpense = currentMonthTransactions.filter(transaction => transaction.type === 'expense');
                setExpenseTransactions(filteredExpense);

                const total = filteredIncome.reduce((sum, transaction) => sum + transaction.amount, 0);
                setTotalIncome(total);

                const totalExpense = filteredExpense.reduce((sum, transaction) => sum + transaction.amount, 0);
                setTotalExpense(totalExpense);

                setMoneyLeft(total - totalExpense);

                const categoryAggregation = {};
                filteredExpense.forEach(transaction => {
                    if (categoryAggregation[transaction.category]) {
                        categoryAggregation[transaction.category] += transaction.amount;
                    } else {
                        categoryAggregation[transaction.category] = transaction.amount;
                    }
                });

                const categoryArray = Object.keys(categoryAggregation).map(category => ({
                    name: category,
                    value: categoryAggregation[category],
                }));
                setCategoryData(categoryArray);
            } catch (error) {
                console.log(error);
            }
        };

        fetchData();
    }, []);

    const sortTransactions = (criteria, order) => {
        const filteredTransactions = filteredCategory === 'all'
            ? expenseTransactions
            : expenseTransactions.filter(transaction => transaction.category === filteredCategory);

        const sorted = [...filteredTransactions].sort((a, b) => {
            if (criteria === 'date') {
                return order === 'asc'
                    ? new Date(a.date) - new Date(b.date)
                    : new Date(b.date) - new Date(a.date);
            }
            if (criteria === 'amount') {
                return order === 'asc' ? a.amount - b.amount : b.amount - a.amount;
            }
            return 0;
        });
        setSortedTransactions(sorted);
    };

    useEffect(() => {
        sortTransactions(sortCriteria, sortOrder);
    }, [sortCriteria, sortOrder, transactions, filteredCategory]);

    const toggleSortOrder = () => {
        setSortOrder(prevOrder => (prevOrder === 'asc' ? 'desc' : 'asc'));
    };

    const addTransaction = async e => {
        e.preventDefault();

        try {
            const newTransaction = {
                type,
                amount: parseFloat(amount),
                description,
                category,
                date,
                userid: user._id,
            };

            await axios.post('/api/transaction/addtransaction', newTransaction);
            window.location.reload();
        } catch (error) {
            console.log('Error adding transaction:', error);
        }
    };

    return (
        <div className="container my-4">
            <h1 className="text-center mb-4">Expenses</h1>

            {/* Summary Section */}
            <div className="row mb-4">
                <div className="col-md-4">
                    <div className="card text-white bg-success mb-3">
                        <div className="card-body">
                            <h5 className="card-title">Total Income</h5>
                            <p className="card-text">${totalIncome.toFixed(2)}</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="card text-white bg-danger mb-3">
                        <div className="card-body">
                            <h5 className="card-title">Total Expenses</h5>
                            <p className="card-text">${totalExpense.toFixed(2)}</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="card text-white bg-info mb-3">
                        <div className="card-body">
                            <h5 className="card-title">Money Left</h5>
                            <p
                                className="card-text"
                                style={{ color: moneyLeft > 0 ? 'green' : 'red',
                                    fontWeight: 'bold',
                                 }}
                            >
                                ${moneyLeft.toFixed(2)}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Pie Chart and Transactions Side by Side */}
            <div className="row mb-4">
                <div className="col-md-6">
                    <PieChart width={400} height={400}>
                        <Pie
                            data={categoryData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={150}
                            fill="#8884d8"
                            dataKey="value"
                        >
                            {categoryData.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={COLORS[index % COLORS.length]}
                                />
                            ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                    </PieChart>
                </div>

                            

                <div className="col-md-6">
                    <br />
                    {/* Sorting Dropdown */}
                    <div className="mb-4 d-flex justify-content-center">
                        <h1>edit</h1>
                        <select
                            className="form-select w-auto"
                            value={`${sortCriteria}-${sortOrder}`}
                            onChange={e => {
                                const [criteria, order] = e.target.value.split('-');
                                setSortCriteria(criteria);
                                setSortOrder(order);
                            }}
                        >
                            <option value="date-asc">Date Ascending</option>
                            <option value="date-desc">Date Descending</option>
                            <option value="amount-asc">Amount Ascending</option>
                            <option value="amount-desc">Amount Descending</option>
                        </select>

                        <select
                            className="form-select w-auto"
                            value={filteredCategory}
                            onChange={e => setFilteredCategory(e.target.value)}
                        >
                            <option value="all">All Categories</option>
                            {categoryData.map((cat, index) => (
                                <option key={index} value={cat.name}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    {sortedTransactions.length > 0 ? (
                        <div className="table-responsive">
                            <table className="table table-striped table-hover">
                                <thead className="table-dark">
                                    <tr>
                                        <th>Date</th>
                                        <th>Description</th>
                                        <th>Type</th>
                                        <th>Category</th>
                                        <th>Amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {sortedTransactions
                                        .slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage)
                                        .map((transaction, index) => (
                                            <tr key={index}>
                                                <td>{new Date(transaction.date).toLocaleDateString()}</td>
                                                <td>{transaction.description}</td>
                                                <td>{transaction.type}</td>
                                                <td>{transaction.category}</td>
                                                <td>${transaction.amount.toFixed(2)}</td>
                                            </tr>
                                        ))}
                                </tbody>
                            </table>
                            {/* Pagination Controls */}
                            <div className="d-flex justify-content-between align-items-center mt-3">
                                <button
                                    className="btn btn-sm btn-primary"
                                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                    disabled={currentPage === 1}
                                >
                                    Previous
                                </button>
                                <span>
                                    Page {currentPage} of {Math.ceil(sortedTransactions.length / rowsPerPage)}
                                </span>
                                <button
                                    className="btn btn-sm btn-primary"
                                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(sortedTransactions.length / rowsPerPage)))}
                                    disabled={currentPage === Math.ceil(sortedTransactions.length / rowsPerPage)}
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    ) : (
                        <p className="text-center">No transactions found.</p>
                    )}
                    {/* Add Transaction Button */}
                    <div className="text-center mb-4">
                        <button
                            className="btn btn-primary"
                            onClick={() => setIsFormVisible(!isFormVisible)}
                        >
                            {isFormVisible ? 'Cancel' : 'Add Transaction'}
                        </button>
                    </div>
                </div>
            </div>

            {/* Add Transaction Form */}
            {isFormVisible && (
                <div className="row">
                    <div className="col-md-6 offset-md-3">
                        <div className="card">
                            <div className="card-body">
                                <h5 className="card-title text-center">Add Transaction</h5>
                                <form onSubmit={addTransaction}>
                                    <div className="mb-3">
                                        <label>Type</label>
                                        <select
                                            className="form-select"
                                            value={type}
                                            onChange={e => setType(e.target.value)}
                                        >
                                            <option value="income">Income</option>
                                            <option value="expense">Expense</option>
                                        </select>
                                    </div>
                                    <div className="mb-3">
                                        <label>Amount</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            value={amount}
                                            onChange={e => setAmount(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label>Description</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={description}
                                            onChange={e => setDescription(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label>Category</label>
                                        <select
                                            className="form-select"
                                            value={category}
                                            onChange={e => setCategory(e.target.value)}
                                            required
                                        >
                                            <option value="" disabled>Select a category</option>
                                            <option value="rent">Rent</option>
                                            <option value="car payment">Car Payment</option>
                                            <option value="tax">Tax</option>
                                            <option value="misc expense">Misc</option>
                                        </select>
                                    </div>
                                    <div className="mb-3">
                                        <label>Date</label>
                                        <input
                                            type="date"
                                            className="form-control"
                                            value={date}
                                            onChange={e => setDate(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <button type="submit" className="btn btn-success w-100">
                                        Add Transaction
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Homescreen;
