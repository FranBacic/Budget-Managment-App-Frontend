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
    const [currentCategoryData, setCurrentCategoryData] = useState([]);
    const [isFormVisible, setIsFormVisible] = useState(false);

    const [type, setType] = useState('expense');
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [date, setDate] = useState('');

    const [editingTransaction, setEditingTransaction] = useState(null);
    const [deletingTransaction, setDeletingTransaction] = useState(null);
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#FF6384'];

    if (!user) {
        window.location.href = '/login';
    }


    useEffect(() => {
        const fetchData = async () => {
            try {

                const userResponse = await axios.get(`/api/user/${user._id}`);
                const updatedUser = userResponse.data;
                setMoneyLeft(updatedUser.moneyLeft);

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

                //setMoneyLeft(total - totalExpense);

                const categoryAggregation = {};
                data.forEach(transaction => {
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



                const currentMonthCategoryAggregation = {};
                filteredExpense.forEach(transaction => {
                    if (currentMonthCategoryAggregation[transaction.category]) {
                        currentMonthCategoryAggregation[transaction.category] += transaction.amount;
                    } else {
                        currentMonthCategoryAggregation[transaction.category] = transaction.amount;
                    }
                });

                const currentMonthCategoryArray = Object.keys(currentMonthCategoryAggregation).map(category => ({
                    name: category,
                    value: currentMonthCategoryAggregation[category],
                }));
                setCurrentCategoryData(currentMonthCategoryArray);
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

    const startDeletingTransaction = (transaction) => {
        console.log("Deleting transaction:", transaction);
        setDeletingTransaction(transaction);
    };


    const handleDelete = async (transactionid) => {
        console.log("Handling delete for transaction ID:", transactionid);
        try {
            await axios.delete(`/api/transaction/deleteTransaction/${transactionid}`);
            alert("Transaction deleted successfully!");
            window.location.reload();
        } catch (error) {
            console.error("Error deleting transaction:", error);
        }

    };

    const startEditingTransaction = (transactions) => {
        setEditingTransaction(transactions);
        setDate(transactions.date);
        setDescription(transactions.description);
        setType(transactions.type);
        setCategory(transactions.category);
        setAmount(transactions.amount);
    };

    const updateTransaction = async (e) => {
        e.preventDefault();
        try {

            console.log("RADI 1")
            await axios.put('/api/transaction/updatetransaction', {

                type: type,
                amount: parseFloat(amount),
                description: description,
                category: category,
                date: date,
                userid: user._id,
                transactionid: editingTransaction._id
            });

            console.log("RADI 2")

            alert("Transaction updated successfully!");
            setEditingTransaction(null);


            const response = await axios.get('/api/transaction/getusertransactions', {
                params: { userid: user._id },
            });
            const data = response.data;
            setTransactions(data);
            window.location.reload();
        } catch (error) {
            console.error("Error updating goal:", error);
        }
    };

    return (
        <div className='landing-container'> 
        <div className="container my-4">
            <h1 className="text-center mb-4">Expenses</h1>

            {/* Summary Section */}
            <div className="row mb-4">
                <div className="col-md-4">
                        <div className="card mb-3">
                            <div className="card-body text-center">
                                <h5 className="card-title">Total Income</h5>
                                <p className="card-text" style={{
                                    color: 'green',
                                    fontWeight: 'bold',
                                }}>{user.currency} {totalIncome.toFixed(2)}</p>
                            </div>
                        </div>
                </div>
                <div className="col-md-4">
                        <div className="card mb-3">
                            <div className="card-body text-center">
                                <h5 className="card-title">Total Expenses</h5>
                                <p className="card-text" style={{
                                    color: 'red',
                                    fontWeight: 'bold',
                                }}>{user.currency} {totalExpense.toFixed(2)}</p>
                            </div>
                        </div>
                </div>
                <div className="col-md-4">
                        <div className="card  mb-3">
                            <div className="card-body text-center">
                                <h5 className="card-title">Money Left</h5>
                                <p
                                    className="card-text"
                                    style={{
                                        color: moneyLeft > 0 ? 'green' : 'red',
                                        fontWeight: 'bold',
                                    }}
                                >
                                    {user.currency} {moneyLeft.toFixed(2)}</p>
                            </div>
                        </div>
                </div>
            </div>

            {/* Pie Chart and Transactions Side by Side */}
            <div className="row mb-4">
                <div className="col-md-6">
                    <PieChart width={400} height={400}>
                        <Pie
                            data={currentCategoryData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={150}
                            fill="#8884d8"
                            dataKey="value"
                        >
                            {currentCategoryData.map((entry, index) => (
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
                            <table className="table table-striped table-hover table-bordered">
                                <thead className="table-dark text-center">
                                    <tr>
                                        <th>Date</th>
                                        <th>Description</th>
                                        <th>Type</th>
                                        <th>Category</th>
                                        <th>Amount</th>
                                        <th>Edit</th>
                                        <th>Delete</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {sortedTransactions
                                        .slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage)
                                        .map((transaction, index) => (
                                            <tr key={index} className='align-middle text-center'>
                                                <td>{new Date(transaction.date).toLocaleDateString()}</td>
                                                <td>{transaction.description}</td>
                                                <td>{transaction.type}</td>
                                                <td>{transaction.category}</td>
                                                <td>${transaction.amount.toFixed(2)}</td>
                                                <td><button className="btn btn-warning btn-sm"
                                                    onClick={() => startEditingTransaction(transaction)}>
                                                    Edit
                                                </button>
                                                </td>
                                                <td>
                                                    <button
                                                        className="btn btn-danger btn-sm"
                                                        onClick={() => {
                                                            console.log("Delete button clicked for:", transaction);
                                                            startDeletingTransaction(transaction);
                                                        }}>
                                                        Delete
                                                    </button>


                                                </td>
                                            </tr>
                                        ))}
                                </tbody>
                            </table>
                            {/* Pagination Controls */}
                            <div className="d-flex justify-content-between align-items-center mt-3">
                                <button
                                    className="btn btn-sm "
                                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                    disabled={currentPage === 1}
                                >
                                    Previous
                                </button>
                                <span>
                                    Page {currentPage} of {Math.ceil(sortedTransactions.length / rowsPerPage)}
                                </span>
                                <button
                                    className="btn btn-sm "
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
                            className="btn btn-warning"
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
                                        <label>Add new category</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="newCat"
                                            value={category} // Dodano za dvosmerno vezivanje
                                            onChange={e => setCategory(e.target.value)}
                                            placeholder='Enter new Category'
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
                                            {/* Ako je input prazan, opcija 'Adding new' se onemogućava */}
                                            <option value="" disabled>
                                                Select a category
                                            </option>
                                            <option value="new" disabled={category.trim() === ''}>
                                                Adding new: {category.trim() || 'Enter a category above'}
                                            </option>
                                            {categoryData.map((cat, index) => (
                                                <option key={index} value={cat.name}>
                                                    {cat.name}
                                                </option>
                                            ))}
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

            {editingTransaction && (
                <form onSubmit={updateTransaction} className="mt-3">
                    <h3>Update Transaction</h3>
                    <input type="date" className="form-control mb-2"
                        value={date ? new Date(date).toISOString().split("T")[0] : ""}
                        onChange={(e) => setDate(e.target.value)} required />
                    <input type="text" className="form-control mb-2"
                        value={description} onChange={(e) => setDescription(e.target.value)} required />
                    <input type="text" className="form-control mb-2"
                        value={type} onChange={(e) => setType(e.target.value)} required />
                    <input type="text" className="form-control mb-2"
                        value={category} onChange={(e) => setCategory(e.target.value)} required />

                    <input type="number" className="form-control mb-2"
                        value={amount} onChange={(e) => setAmount(e.target.value)} required />

                    <button type="submit" className="btn btn-warning w-100">Update Transaction</button>
                </form>
            )}

            {deletingTransaction && (
                <div>
                    <p>Are you sure you want to delete this transaction "<b>{deletingTransaction.description}</b>"?</p>
                    <button onClick={() => handleDelete(deletingTransaction._id)}>Confirm</button>
                    <button onClick={() => setDeletingTransaction(null)}>Cancel</button>
                </div>
            )}
        </div>
        </div>
    );
}

export default Homescreen;
