import { storage } from '../functions/storage';
import { v4 as uuidv4 } from 'uuid';

// Offline Database Manager
export class OfflineDB {
  // Initialize default data
  static initializeDefaultData() {
    if (!storage.contains('offline.initialized')) {
      // Default user data with profile picture
      const defaultUser = {
        id: '1',
        name: 'Demo User',
        number: '9876543210',
        country_code: '91',
        pic: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&h=400&fit=crop',
        token: 'offline_token_' + Date.now(),
        device_token: 'offline_device_token',
        credits: 100,
      };

      storage.set('user.id', defaultUser.id);
      storage.set('user.name', defaultUser.name);
      storage.set('user.number', defaultUser.number);
      storage.set('user.country_code', defaultUser.country_code);
      storage.set('user.pic', defaultUser.pic);
      storage.set('user.token', defaultUser.token);
      storage.set('user.credits', defaultUser.credits.toString());

      // Initialize empty collections
      storage.set('offline.events', JSON.stringify([]));
      storage.set('offline.contacts', JSON.stringify([]));
      storage.set('offline.guests', JSON.stringify({}));
      storage.set('offline.comments', JSON.stringify({}));
      storage.set('offline.questions', JSON.stringify({}));
      storage.set('offline.galleries', JSON.stringify({}));
      
      storage.set('offline.initialized', 'true');
    }
  }

  // User operations
  static getUser() {
    return {
      id: storage.getString('user.id') || '1',
      name: storage.getString('user.name') || 'Demo User',
      number: storage.getString('user.number') || '9876543210',
      country_code: storage.getString('user.country_code') || '91',
      pic: storage.getString('user.pic') || '',
      credits: parseInt(storage.getString('user.credits') || '100'),
    };
  }

  static updateUser(data: any) {
    if (data.name) storage.set('user.name', data.name);
    if (data.pic) storage.set('user.pic', data.pic);
    if (data.number) storage.set('user.number', data.number);
    if (data.country_code) storage.set('user.country_code', data.country_code);
    return this.getUser();
  }

  // Events operations
  static getEvents() {
    const eventsStr = storage.getString('offline.events');
    return eventsStr ? JSON.parse(eventsStr) : [];
  }

  static saveEvents(events: any[]) {
    storage.set('offline.events', JSON.stringify(events));
  }

  static getEventById(eventId: number | string) {
    const events = this.getEvents();
    return events.find((e: any) => e.evt_id.toString() === eventId.toString());
  }

  static addEvent(eventData: any) {
    const events = this.getEvents();
    const newEvent = {
      evt_id: Date.now(),
      ...eventData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    events.push(newEvent);
    this.saveEvents(events);
    return newEvent;
  }

  static updateEvent(eventId: number | string, eventData: any) {
    const events = this.getEvents();
    const index = events.findIndex((e: any) => e.evt_id.toString() === eventId.toString());
    if (index !== -1) {
      events[index] = {
        ...events[index],
        ...eventData,
        updated_at: new Date().toISOString(),
      };
      this.saveEvents(events);
      return events[index];
    }
    return null;
  }

  static deleteEvent(eventId: number | string) {
    const events = this.getEvents();
    const filtered = events.filter((e: any) => e.evt_id.toString() !== eventId.toString());
    this.saveEvents(filtered);
    return true;
  }

  // Contacts operations
  static getContacts() {
    const contactsStr = storage.getString('offline.contacts');
    return contactsStr ? JSON.parse(contactsStr) : [];
  }

  static saveContacts(contacts: any[]) {
    storage.set('offline.contacts', JSON.stringify(contacts));
  }

  static addContacts(newContacts: any[]) {
    const contacts = this.getContacts();
    const contactsWithIds = newContacts.map(c => ({
      ...c,
      id: c.id || uuidv4(),
      created_at: new Date().toISOString(),
    }));
    const merged = [...contacts, ...contactsWithIds];
    this.saveContacts(merged);
    return contactsWithIds;
  }

  static updateContact(contactId: string, data: any) {
    const contacts = this.getContacts();
    const index = contacts.findIndex((c: any) => c.id === contactId);
    if (index !== -1) {
      contacts[index] = { ...contacts[index], ...data };
      this.saveContacts(contacts);
      return contacts[index];
    }
    return null;
  }

  static deleteContact(contactId: string) {
    const contacts = this.getContacts();
    const filtered = contacts.filter((c: any) => c.id !== contactId);
    this.saveContacts(filtered);
    return true;
  }

  // Guests operations
  static getEventGuests(eventId: number | string) {
    const guestsStr = storage.getString('offline.guests');
    const allGuests = guestsStr ? JSON.parse(guestsStr) : {};
    return allGuests[eventId.toString()] || [];
  }

  static saveEventGuests(eventId: number | string, guests: any[]) {
    const guestsStr = storage.getString('offline.guests');
    const allGuests = guestsStr ? JSON.parse(guestsStr) : {};
    allGuests[eventId.toString()] = guests;
    storage.set('offline.guests', JSON.stringify(allGuests));
  }

  static addEventGuest(eventId: number | string, guestData: any) {
    const guests = this.getEventGuests(eventId);
    const newGuest = {
      id: Date.now(),
      ...guestData,
      created_at: new Date().toISOString(),
    };
    guests.push(newGuest);
    this.saveEventGuests(eventId, guests);
    return newGuest;
  }

  static updateEventGuest(eventId: number | string, guestId: number | string, data: any) {
    const guests = this.getEventGuests(eventId);
    const index = guests.findIndex((g: any) => g.id.toString() === guestId.toString());
    if (index !== -1) {
      guests[index] = { ...guests[index], ...data };
      this.saveEventGuests(eventId, guests);
      return guests[index];
    }
    return null;
  }

  static deleteEventGuest(eventId: number | string, guestId: number | string) {
    const guests = this.getEventGuests(eventId);
    const filtered = guests.filter((g: any) => g.id.toString() !== guestId.toString());
    this.saveEventGuests(eventId, filtered);
    return true;
  }

  // Gallery operations
  static getEventGallery(eventId: number | string) {
    const galleriesStr = storage.getString('offline.galleries');
    const allGalleries = galleriesStr ? JSON.parse(galleriesStr) : {};
    return allGalleries[eventId.toString()] || [];
  }

  static saveEventGallery(eventId: number | string, gallery: any[]) {
    const galleriesStr = storage.getString('offline.galleries');
    const allGalleries = galleriesStr ? JSON.parse(galleriesStr) : {};
    allGalleries[eventId.toString()] = gallery;
    storage.set('offline.galleries', JSON.stringify(allGalleries));
  }

  // Comments operations
  static getEventComments(eventId: number | string) {
    const commentsStr = storage.getString('offline.comments');
    const allComments = commentsStr ? JSON.parse(commentsStr) : {};
    return allComments[eventId.toString()] || [];
  }

  static saveEventComments(eventId: number | string, comments: any[]) {
    const commentsStr = storage.getString('offline.comments');
    const allComments = commentsStr ? JSON.parse(commentsStr) : {};
    allComments[eventId.toString()] = comments;
    storage.set('offline.comments', JSON.stringify(allComments));
  }

  static addEventComment(eventId: number | string, commentData: any) {
    const comments = this.getEventComments(eventId);
    const newComment = {
      id: Date.now(),
      text: commentData.text,
      image: commentData.image || null,
      user_id: commentData.user_id,
      user_name: commentData.user_name,
      user_pic: commentData.user_pic,
      created_at: new Date().toISOString(),
    };
    comments.push(newComment);
    this.saveEventComments(eventId, comments);
    return newComment;
  }

  // Questions operations
  static getEventQuestions(eventId: number | string) {
    const questionsStr = storage.getString('offline.questions');
    const allQuestions = questionsStr ? JSON.parse(questionsStr) : {};
    return allQuestions[eventId.toString()] || [];
  }

  static saveEventQuestions(eventId: number | string, questions: any[]) {
    const questionsStr = storage.getString('offline.questions');
    const allQuestions = questionsStr ? JSON.parse(questionsStr) : {};
    allQuestions[eventId.toString()] = questions;
    storage.set('offline.questions', JSON.stringify(allQuestions));
  }

  static addEventQuestion(eventId: number | string, questionData: any) {
    const questions = this.getEventQuestions(eventId);
    const newQuestion = {
      id: Date.now(),
      ...questionData,
      created_at: new Date().toISOString(),
    };
    questions.push(newQuestion);
    this.saveEventQuestions(eventId, questions);
    return newQuestion;
  }

  // Clear all data
  static clearAll() {
    storage.delete('offline.events');
    storage.delete('offline.contacts');
    storage.delete('offline.guests');
    storage.delete('offline.comments');
    storage.delete('offline.questions');
    storage.delete('offline.galleries');
    storage.delete('offline.initialized');
  }
}
