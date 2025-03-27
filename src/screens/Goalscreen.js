import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Goalscreen() {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    const [goals, setGoals] = useState([]);
    const [goalName, setGoalName] = useState('');
    const [goalAmount, setGoalAmount] = useState('');
    const [moneySaved, setMoneySaved] = useState('');
    const [selectedGoalId, setSelectedGoalId] = useState(null);
    const [editingGoal, setEditingGoal] = useState(null);
    const [moneyLeft, setMoneyLeft] = useState(0);
    const [showAddGoalForm, setShowAddGoalForm] = useState(false);

    if (!user) {
        window.location.href = '/login';
    }

    useEffect(() => {
        const fetchGoals = async () => {
            try {
                const response = await axios.get(`/api/user/${user._id}`);
                setGoals(response.data.goals);
                setMoneyLeft(response.data.moneyLeft);
            } catch (error) {
                console.error("Error fetching goals:", error);
            }
        };

        fetchGoals();
    }, [user._id]);

    const addGoal = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/api/user/addgoal', {
                userid: user._id,
                name: goalName,
                goalAmount: parseFloat(goalAmount),
                moneySaved: parseFloat(moneySaved),
            });

            alert("Goal added successfully!");
            setGoalName('');
            setGoalAmount('');
            setMoneySaved('');
            setShowAddGoalForm(false);

            const response = await axios.get(`/api/user/${user._id}`);
            setGoals(response.data.goals);
        } catch (error) {
            console.error("Error adding goal:", error);
        }
    };

    const addMoneyToGoal = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/api/user/addgoalmoney', {
                userid: user._id,
                goalid: selectedGoalId,
                moneySaved: parseFloat(moneySaved),
            });

            alert("Money added successfully!");
            setMoneySaved('');

            const updatedUserResponse = await axios.get(`/api/user/${user._id}`);
            setGoals(updatedUserResponse.data.goals);
            setMoneyLeft(updatedUserResponse.data.moneyLeft);
        } catch (error) {
            console.error("Error adding money:", error);
        }
    };

    const startEditingGoal = (goal) => {
        setEditingGoal(goal);
        setGoalName(goal.name);
        setGoalAmount(goal.goalAmount);
        setMoneySaved(goal.moneySaved);
    };

    const updateGoal = async (e) => {
        e.preventDefault();
        try {
            await axios.put('/api/user/updategoal', {
                userid: user._id,
                goalid: editingGoal._id,
                updatedName: goalName,
                updatedGoalAmount: parseFloat(goalAmount),
                updatedMoneySaved: parseFloat(moneySaved),
            });

            alert("Goal updated successfully!");
            setEditingGoal(null);

            const response = await axios.get(`/api/user/${user._id}`);
            setGoals(response.data.goals);
        } catch (error) {
            console.error("Error updating goal:", error);
        }
    };

    return (
        <div className='landing-container'> 
        <div className="container my-4">
            <h1 className="text-center">Your Goals</h1>
            

            <div className="d-flex justify-content-center my-4">
                    <div className="card  mb-3 " style={{ width: "40rem"}}>
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


            
            <div className="table-responsive">
                <table className="table table-striped table-hover table-bordered">
                    <thead className="table-dark text-center">
                        <tr>
                            <th>Goal Name</th>
                            <th>Saved</th>
                            <th>Total Goal</th>
                            <th>Progress</th>
                            <th>Add Money</th>
                            <th>Edit</th>
                        </tr>
                    </thead>
                    <tbody>
                        {goals.length > 0 ? (
                            goals.map((goal) => {
                                const progress = (goal.moneySaved / goal.goalAmount) * 100;

                                return (
                                    <tr key={goal._id} className="align-middle text-center">
                                        <td className="fw-bold">{goal.name}</td>
                                        <td>{user.currency} {goal.moneySaved}</td>
                                        <td>{user.currency} {goal.goalAmount}</td>
                                        <td>
                                            <div className="progress" style={{ height: '10px' }}>
                                                <div className="progress-bar bg-primary"
                                                    role="progressbar"
                                                    style={{ width: `${progress}%` }}
                                                    aria-valuenow={progress}
                                                    aria-valuemin="0"
                                                    aria-valuemax="100">
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <button className="btn btn-success btn-sm"
                                                onClick={() => setSelectedGoalId(selectedGoalId === goal._id ? null : goal._id)}>
                                                {selectedGoalId === goal._id ? 'Cancel' : 'Add Money'}
                                            </button>
                                        </td>
                                        <td>
                                            <button className="btn btn-warning btn-sm"
                                                onClick={() => startEditingGoal(goal)}>
                                                Edit
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan="6" className="text-center">No goals added yet.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Forma za dodavanje novca se prikazuje ispod ako je cilj selektovan */}
            {selectedGoalId && (
                <div className="card p-3 mt-3">
                    <h5 className="text-center">Add Money to Goal</h5>
                    <form onSubmit={addMoneyToGoal}>
                        <div className="mb-3">
                            <label>Amount</label>
                            <input type="number" className="form-control"
                                value={moneySaved}
                                onChange={e => setMoneySaved(e.target.value)}
                                placeholder='Enter Amount' required />
                        </div>
                        <button type="submit" className="btn btn-primary w-100"
                            disabled={parseFloat(goals.find(g => g._id === selectedGoalId)?.moneySaved) >= parseFloat(goals.find(g => g._id === selectedGoalId)?.goalAmount)}>
                            Add Money
                        </button>
                    </form>
                </div>
            )}


            <div className="text-center mt-3">
                <button className="btn btn-primary" onClick={() => setShowAddGoalForm(!showAddGoalForm)}>
                    {showAddGoalForm ? "Cancel" : "Add Goal"}
                </button>
            </div>

            {showAddGoalForm && (
                <form onSubmit={addGoal} className="mt-3">
                    <h3>Add a New Goal</h3>
                    <input type="text" className="form-control mb-2"
                        value={goalName} onChange={(e) => setGoalName(e.target.value)}
                        placeholder="Goal Name" required />
                    <input type="number" className="form-control mb-2"
                        value={goalAmount} onChange={(e) => setGoalAmount(e.target.value)}
                        placeholder="Goal Amount" required />
                    <input type="number" className="form-control mb-2"
                        value={moneySaved} onChange={(e) => setMoneySaved(e.target.value)}
                        placeholder="Money Saved" required />
                    <button type="submit" className="btn btn-primary w-100">Add Goal</button>
                </form>
            )}

            {editingGoal && (
                <form onSubmit={updateGoal} className="mt-3">
                    <h3>Update Goal</h3>
                    <input type="text" className="form-control mb-2"
                        value={goalName} onChange={(e) => setGoalName(e.target.value)} required />
                    <input type="number" className="form-control mb-2"
                        value={goalAmount} onChange={(e) => setGoalAmount(e.target.value)} required />
                    <input type="number" className="form-control mb-2"
                        value={moneySaved} onChange={(e) => setMoneySaved(e.target.value)} required />
                    <button type="submit" className="btn btn-warning w-100">Update Goal</button>
                </form>
            )}
        </div>
        </div>
    );
}

export default Goalscreen;
