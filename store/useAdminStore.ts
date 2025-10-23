"use client"
import {create} from 'zustand';
import api from '@/lib/api';

export interface EmployeeData{
    email: string,
    email_verified: boolean,
    id: string,
    name: string,
    supervisor_id: string
}

export interface SupervisorData{
    email: string,
    email_verified: boolean,
    id: string,
    name: string
}

interface AdminState{
    loading?: boolean,
    error?: string| null,
    fetchAdminData: ()=> Promise<void>,
    employees: EmployeeData[],
    employee_count:number,
    organization: {
        created_at: string,
        description: string,
        id: string,
        name: string
    },
    owner: {
        email: string,
        id: string,
        name: string
    },
    supervisors: SupervisorData[],
    supervisors_count: number,
    getSupervisorById: (supervisorId: string)=> SupervisorData | undefined,
}

export const useAdminStore = create<AdminState>((set,get)=>({
    employees:[],
    employee_count:0,
    organization:{
        created_at:"",
        description:"",
        id:"",
        name: "",
    },
    owner:{
        email: "",
        id: "",
        name: "",
    },
    supervisors:[],
    supervisors_count:0,

    fetchAdminData: async()=>{
        set({loading: true, error:null});
        try{
            const response = await api.get('/debug/db-info');
            const data= response.data || response.data.data;

            set({
                loading: false,
                employees: data.employees,
                employee_count: data.employee_count,
                organization: data.organization,
                owner: data.owner,
                supervisors: data.supervisors,
                supervisors_count: data.supervisors_count,
            });

        } catch (error: any) {
            set({loading: false, error: error.message || "Unknown error"});
            throw new Error(error.message|| "Unknown error");
        }
    },

    getSupervisorById: (supervisorId: string)=>{
        const {supervisors} = get();
        return supervisors.find((s)=> s.id === supervisorId);
    }
}));
