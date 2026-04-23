const URL_BASE = "http://localhost:8080"

export const endpoints = {
    login:    `${URL_BASE}/auth/login`,
    register: `${URL_BASE}/auth/register`,
    expenses: `${URL_BASE}/expenses`,
    category: `${URL_BASE}/category`,
    users:    `${URL_BASE}/users`,
}
 
 
export const loginRequest = async (data) => {
    const response = await fetch(endpoints.login, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)   
    })
    return await response.json()    
}
 

export const registerRequest = async (data) => {
    const response = await fetch(endpoints.register, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    })
    return await response.json()
}
 
 

export const getExpenses = async () => {
  
    const token = localStorage.getItem("token")
 
    const response = await fetch(endpoints.expenses, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`  // Le decimos al backend quién somos
        }
    })
    return await response.json()
}
 
export const createExpense = async (data) => {
    const token = localStorage.getItem("token")
 
    const response = await fetch(endpoints.expenses, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(data)
    })
    return await response.json()
}