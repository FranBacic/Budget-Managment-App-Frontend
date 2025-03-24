import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Adminscreen() {

    const [alUsers, setAllUsers] = useState([]);

    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (!user) {
        window.location.href = '/login';
    }




    return ( 
        
        <div>
            <h1 className="text-center mb-4">Admin Panel</h1>
            <ul class="nav nav-tabs" id="myTab" role="tablist">
                <li class="nav-item" role="presentation">
                    <button class="nav-link active" id="home-tab" data-bs-toggle="tab" data-bs-target="#home" type="button" role="tab" aria-controls="home" aria-selected="true">Users</button>
                </li>
                <li class="nav-item" role="presentation">
                    <button class="nav-link" id="profile-tab" data-bs-toggle="tab" data-bs-target="#profile" type="button" role="tab" aria-controls="profile" aria-selected="false">All Transactions</button>
                </li>
                
            </ul>
            <div class="tab-content" id="myTabContent">
                <div class="tab-pane fade show active" id="home" role="tabpanel" aria-labelledby="home-tab"><Users/></div>

                <div class="tab-pane fade" id="profile" role="tabpanel" aria-labelledby="profile-tab"><Transactions /></div>

            </div>
        </div>   
     );
}

export default Adminscreen;


export function Users() {

        const user = JSON.parse(localStorage.getItem('currentUser'));
        const [allTransactions, setAllTransactions] = useState([]);
        const [transactions, setTransactions] = useState([]);
        const [sortedTransactions, setSortedTransactions] = useState([]);
        const [sortCriteria, setSortCriteria] = useState('date'); // default sort by date
        const [sortOrder, setSortOrder] = useState('asc'); // 'asc' or 'desc'
        const [filteredCategory, setFilteredCategory] = useState('all'); // New state for category filter
        const [currentPage, setCurrentPage] = useState(1);
        const rowsPerPage = 10;
        const [showModal, setShowModal] = useState(false);
    
        const [incomeTransactions, setIncomeTransactions] = useState([]);
        const [expenseTransactions, setExpenseTransactions] = useState([]);
        const [totalIncome, setTotalIncome] = useState(0);
        const [totalExpense, setTotalExpense] = useState(0);

        const [categoryData, setCategoryData] = useState([]);
        const [currentCategoryData, setCurrentCategoryData] = useState([]);
        const [isFormVisible, setIsFormVisible] = useState(false);
    
        const [name, setName] = useState('income');
        const [email, setEmail] = useState('');
        const [isAdmin, setIsAdmin] = useState('');
        const [currency, setCurrency] = useState('');
        const [moneyLeft, setMoneyLeft] = useState(0);
    
        const [editingUser, setEditingUser] = useState(null);
        const [deletingUser, setDeletingUser] = useState(null);
        const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#FF6384'];

        const [allUsers, setAllUsers] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {

                const userResponse = await axios.get(`/api/user/${user._id}`);
                const updatedUser = userResponse.data;
                setMoneyLeft(updatedUser.moneyLeft);

                const allUsersResponse = await axios.get(`/api/user/getallusers`);
                const allUsers = allUsersResponse.data;
                setAllUsers(allUsers);

                const response = await axios.get('/api/transaction/getusertransactions', {
                    params: { userid: user._id },
                });
                const data = response.data;

                setAllTransactions(data);
                setSortedTransactions([...data]);

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
                filteredIncome.forEach(transaction => {
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



    const startEditingUser = (users) => {
        setEditingUser(users);
        setName(users.name);
        setEmail(users.email);
        setIsAdmin(users.isAdmin);
        setCurrency(users.currency);
        setMoneyLeft(users.moneyLeft);
    };

    const updateUser = async (e) => {
        e.preventDefault();
        try {

            if (!editingUser) {
                console.error("No user selected for editing!");
                return;
            }

            console.log("RADI 1")
            await axios.put('/api/user/updateuser', {

                userid: editingUser._id,
                name: name,
                email: email,
                isAdmin: isAdmin,
                currency: currency,
                moneyLeft: parseFloat(moneyLeft),
            });

            console.log("RADI 2")

            alert("User updated successfully!");
            setEditingUser(null);

            const allUsersResponse = await axios.get(`/api/user/getallusers`);
            const allUsers = allUsersResponse.data;
            setAllUsers(allUsers);

        } catch (error) {
            console.error("Error updating goal:", error);
        }
    };

        const startDeletingUser = (user) => {
            console.log("Deleting User:", user);
            setDeletingUser(user);
        };
    
    
        const handleDelete = async (userid) => {
            console.log("Handling delete for User ID:", userid);
                try {
                    await axios.delete(`/api/user/deleteUser/${userid}`);
                    alert("User deleted successfully!");
                    window.location.reload();
                } catch (error) {
                    console.error("Error deleting user:", error);
                }
            
        };

    return(
        <div className="container mt-4">
            {allUsers.length > 0 ? (
                <div className="table-responsive">
                    <table className="table table-striped table-hover table-bordered">
                        <thead className="table-dark text-center">
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Is Admin</th>
                                <th>Currency</th>
                                <th>Money Left</th>
                                <th>Edit</th>
                                <th>Delete</th>
                            </tr>
                        </thead>
                        <tbody>
                            {allUsers
                                .slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage)
                                .map((user, index) => (
                                    <tr key={index} className="align-middle text-center">
                                        <td>{user._id}</td>
                                        <td>{user.name}</td>
                                        <td>{user.email}</td>
                                        <td>
                                            <span className={`badge ${user.isAdmin ? 'bg-success' : 'bg-danger'}`}>
                                                {user.isAdmin ? 'Admin' : 'User'}
                                            </span>
                                        </td>

                                        <td>{user.currency}</td>
                                        <td className="fw-bold">{user.moneyLeft}</td>
                                        <td>
                                            <button className="btn btn-warning btn-sm"
                                                onClick={() => startEditingUser(user)}>
                                                Edit
                                            </button>
                                        </td>
                                        <td>
                                            <button
                                                className="btn btn-danger btn-sm"
                                                onClick={() => {
                                                    console.log("Delete button clicked for:", user);
                                                    startDeletingUser(user);
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
                            className="btn btn-sm btn-primary"
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                        >
                            Previous
                        </button>
                        <span className="fw-bold">
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
                <p className="text-center text-muted fs-5">No transactions found.</p>
            )}

            {editingUser && (
                <form onSubmit={updateUser} className="mt-3">
                    <h3>Update User</h3>
                    <input type="text" className="form-control mb-2"
                        value={name} onChange={(e) => setName(e.target.value)} required />
                    <input type="text" className="form-control mb-2"
                        value={email} onChange={(e) => setEmail(e.target.value)} required />
                    <input type="text" className="form-control mb-2"
                        value={isAdmin} onChange={(e) => setIsAdmin(e.target.value)} required />
                    <input type="text" className="form-control mb-2"
                        value={currency} onChange={(e) => setCurrency(e.target.value)} required />
                    <input type="number" className="form-control mb-2"
                        value={moneyLeft} onChange={(e) => setMoneyLeft(e.target.value)} required />

                    <button type="submit" className="btn btn-warning w-100">Update User</button>
                </form>
            )}

            {deletingUser && (
                <div>
                    <p>Are you sure you want to delete user <b>{deletingUser.name}</b>?</p>
                    <button onClick={() => handleDelete(deletingUser._id)}>Confirm</button>
                    <button onClick={() => setDeletingUser(null)}>Cancel</button>
                </div>
            )}
        </div>
    )
}

export function Transactions() {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    const [allTransactions, setAllTransactions] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [sortedTransactions, setSortedTransactions] = useState([]);
    const [sortCriteria, setSortCriteria] = useState('date'); // default sort by date
    const [sortOrder, setSortOrder] = useState('asc'); // 'asc' or 'desc'
    const [filteredCategory, setFilteredCategory] = useState('all'); // New state for category filter
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 10;
    const [showModal, setShowModal] = useState(false);

    const [incomeTransactions, setIncomeTransactions] = useState([]);
    const [expenseTransactions, setExpenseTransactions] = useState([]);
    const [totalIncome, setTotalIncome] = useState(0);
    const [totalExpense, setTotalExpense] = useState(0);
    const [moneyLeft, setMoneyLeft] = useState(0);
    const [categoryData, setCategoryData] = useState([]);
    const [isFormVisible, setIsFormVisible] = useState(false);

    const [type, setType] = useState('income');
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [date, setDate] = useState('');

    const [editingTransaction, setEditingTransaction] = useState(null);
    const [deletingTransaction, setDeletingTransaction] = useState(null);
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#FF6384'];

    const [allUsers, setAllUsers] = useState([]);
    const [userMap, setUserMap] = useState({});


    if (!user) {
        window.location.href = '/login';
    }
    useEffect(() => {
        const fetchData = async () => {
            try {

                const usersResponse = await axios.get('/api/user/getallusers');
                const usersData = usersResponse.data;

                setAllUsers(usersData);

                const userMapping = {};
                usersData.forEach(user => {
                    userMapping[user._id] = user.name;
                });

                setUserMap(userMapping);

                const response = await axios.get('/api/transaction/getalltransactions');
                const data = response.data;

                setAllTransactions(data);
                setSortedTransactions([...data]);

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
                filteredIncome.forEach(transaction => {
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

    return (
        <div className="container mt-4">
            {allTransactions.length > 0 ? (
                <div className="table-responsive">
                    <table className="table table-striped table-hover table-bordered">
                        <thead className="table-dark text-center">
                            <tr>
                                <th>User Name</th>
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
                            {allTransactions
                                .slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage)
                                .map((transaction, index) => (
                                    <tr key={index} className="align-middle text-center">
                                        <td>{userMap[transaction.userid] || 'Unknown or Deleted User'}</td>
                                        <td>{new Date(transaction.date).toLocaleDateString()}</td>
                                        <td>{transaction.description}</td>
                                        <td>
                                            <span className={`badge ${transaction.type === 'income' ? 'bg-success' : 'bg-danger'}`}>
                                                {transaction.type}
                                            </span>
                                        </td>
                                        <td>{transaction.category}</td>


                                        <td className="fw-bold">${transaction.amount.toFixed(2)}</td>
                                        <td>
                                            <button
                                                className="btn btn-warning btn-sm"
                                                onClick={() => startEditingTransaction(transaction)}
                                            >
                                                Edit
                                            </button>
                                        </td>
                                        <td>
                                            <button
                                                className="btn btn-danger btn-sm"
                                                onClick={() => {
                                                    console.log("Delete button clicked for:", transaction);
                                                    startDeletingTransaction(transaction);
                                                }}
                                            >
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
                            className="btn btn-sm btn-primary"
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                        >
                            Previous
                        </button>
                        <span className="fw-bold">
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
                <p className="text-center text-muted fs-5">No transactions found.</p>
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
    );

}