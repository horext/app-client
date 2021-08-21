import Vue from 'vue'

export * from './state'
export type VForm = Vue & { validate: () => boolean }

export interface Person {
  id: number;
  firstName: string;
  lastName: string;
  contact: Contact;

  gender: string;
  ipAddress: string;
  avatar: string;
  address: Address;
}

export interface Contact {
  email: string;
  phone: string;
}

export interface Address {
  city: string;
  country: string;
  postalCode: string;
  state: string;
  street: string;
}

export interface User {
  id: Number
  speciality: Speciality
  courses: Course[]
}

export interface Course {
  schedules: Array<any>;
  isFavorite: boolean
  codCurso: string;
  id: number
  codigo: string
  nombre: string
  code: string
  name: string
  sections: Array<Section>
}

export interface Section {
  scheduleSubjectId: any;
  section: any;
  classSessions: any
  idSeccion: any;
  id: number
  code: string;
  numCruces: number;
  schedules: Array<Schedule>;
}

export interface Faculty {
  nombre: any;
  codFacultad: any;
  id: number;
  code: string;
  name: string;
}

export interface Speciality {
  codEspecialidad: any;
  nombre: any;
  id: number
  code: string
  name: string
  faculty: Faculty
}

export interface Schedule {
  sectionCode: string;
  section: string;
  scheduleId: number;
  courseCode: string;
  color: string;
  name: string;
  id: number
  code: string
  title: string
  day: number
  startTime: string
  type: string
  endTime: string
  start: string
  end: string
}

export interface Event extends Schedule {
  start: string
  end: string
  title: string
  description: HTMLElement | string
}

export {}
declare global {
  interface Window {
    gapi: any;
  }
}
window.gapi = window.gapi || {}
