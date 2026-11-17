import { OfflineDB } from '../storage/offlineDB';
import moment from 'moment';

// Simulate API delay for realistic behavior
const simulateDelay = (ms: number = 300) => 
  new Promise(resolve => setTimeout(resolve, ms));

// Offline API implementation
export class OfflineAPI {
  // Auth endpoints
  static async sendOTP(data: any) {
    await simulateDelay();
    
    // Always return success for offline mode
    return {
      StatusCode: 200,
      data: {
        newuser: 'N', // Existing user
        message: 'OTP sent successfully (Offline Mode)',
      },
    };
  }

  static async verifyOTP(data: any) {
    await simulateDelay();
    
    const user = OfflineDB.getUser();
    return {
      StatusCode: 200,
      data: {
        id: user.id,
        token: 'offline_token_' + Date.now(),
        name: user.name,
        pic: user.pic,
        number: user.number,
        country_code: user.country_code,
      },
    };
  }

  static async register(data: any) {
    await simulateDelay();
    
    const userData = {
      name: data.name,
      number: data.mobile,
      country_code: data.country_code,
    };
    
    OfflineDB.updateUser(userData);
    const user = OfflineDB.getUser();
    
    return {
      StatusCode: 200,
      data: {
        ...user,
        token: 'offline_token_' + Date.now(),
      },
    };
  }

  static async logout(data: any) {
    await simulateDelay();
    return {
      StatusCode: 200,
      message: 'Logged out successfully',
    };
  }

  // Profile endpoints
  static async viewProfile(data: any) {
    await simulateDelay();
    
    const user = OfflineDB.getUser();
    return {
      StatusCode: 200,
      data: user,
    };
  }

  static async updateProfile(data: any) {
    await simulateDelay();
    
    const updateData: any = {};
    if (data.name) updateData.name = data.name;
    if (data.pic) updateData.pic = data.pic;
    
    const user = OfflineDB.updateUser(updateData);
    
    return {
      StatusCode: 200,
      data: user,
    };
  }

  static async updateDeviceToken(data: any) {
    await simulateDelay();
    return {
      StatusCode: 200,
      message: 'Device token updated',
    };
  }

  // Dashboard/Events endpoints
  static async getDashboardEvents(data: any) {
    await simulateDelay();
    
    const events = OfflineDB.getEvents();
    const user = OfflineDB.getUser();
    const now = moment();
    
    let filteredEvents = events;
    
    // Filter based on mode
    if (data.mode === 'MY_EVT_LIST_UP') {
      // My upcoming events
      filteredEvents = events.filter((e: any) => 
        moment(e.date, 'DD/MM/YYYY').isAfter(now) && e.is_host
      );
    } else if (data.mode === 'MY_EVT_LIST_PREV') {
      // My previous events
      filteredEvents = events.filter((e: any) => 
        moment(e.date, 'DD/MM/YYYY').isBefore(now) && e.is_host
      );
    } else if (data.mode === 'INV_EVT_LIST_UP') {
      // Invited upcoming events
      filteredEvents = events.filter((e: any) => 
        moment(e.date, 'DD/MM/YYYY').isAfter(now) && e.is_guest && !e.is_host
      );
    } else if (data.mode === 'INV_EVT_LIST_PREV') {
      // Invited previous events
      filteredEvents = events.filter((e: any) => 
        moment(e.date, 'DD/MM/YYYY').isBefore(now) && e.is_guest && !e.is_host
      );
    }
    
    const eventList = filteredEvents.map((e: any) => ({
      evt_id: e.evt_id,
      title: e.name || e.title,
      pic: e.cover_img,
      date: e.date,
      time: e.time,
      goingStatus: e.rsvp || '',
      published: e.published || 'Y',
    }));
    
    return {
      StatusCode: 200,
      data: {
        event_list: eventList,
        list_type: data.mode.includes('UP') ? 'up' : 'prev',
      },
    };
  }

  // Event CRUD operations
  static async addEvent(data: any) {
    await simulateDelay(500);
    
    const user = OfflineDB.getUser();
    const eventData = {
      evt_id: Date.now(),
      name: data.title,
      title: data.title,
      font_id: data.fontId || '1',
      cover_img: data.cover_img,
      bg_img: data.bg_img || '',
      color_hex: data.colorHex || '',
      date: data.date,
      time: data.time,
      type: data.type || 'off',
      location: data.location || '',
      link: data.link || '',
      event_disc: data.eventDisc || '',
      rsvp: data.rsvp,
      published: data.published || 'N',
      is_host: true,
      is_guest: false,
      host_list: [{
        id: user.id,
        name: user.name,
        pic: user.pic,
      }],
      event_config: {
        published: data.published || 'N',
        rsvp_url: data.rsvp_url || '',
        accept_rsvp: 'Y',
        accept_maybe: 'Y',
        rsvp_button_style: 0,
        show_count_guests: 'Y',
        open_event: 'N',
        max_capacity: 0,
        guest_approval: 'N',
        additional_guests: 0,
        activity_timeline: 'Y',
        guest_status_share: 'Y',
        guest_posts: 'Y',
        guest_upload: 'Y',
      },
      rsvp_url: `https://planorama.in/e/${Date.now()}`,
      rsvp_guest_type: 'H',
      rsvp_guest_approved: 'Y',
    };
    
    const newEvent = OfflineDB.addEvent(eventData);
    
    return {
      StatusCode: 200,
      data: {
        event_id: newEvent.evt_id,
        message: 'Event created successfully',
      },
    };
  }

  static async updateEvent(data: any) {
    await simulateDelay(500);
    
    const updateData = {
      name: data.title,
      title: data.title,
      font_id: data.fontId,
      cover_img: data.cover_img,
      bg_img: data.bg_img,
      color_hex: data.colorHex,
      date: data.date,
      time: data.time,
      type: data.type,
      location: data.location,
      link: data.link,
      event_disc: data.eventDisc,
      rsvp: data.rsvp,
      published: data.published,
    };
    
    OfflineDB.updateEvent(data.event_id, updateData);
    
    return {
      StatusCode: 200,
      data: {
        event_id: data.event_id,
        message: 'Event updated successfully',
      },
    };
  }

  static async viewEvent(data: any) {
    await simulateDelay();
    
    const event = OfflineDB.getEventById(data.event_id);
    
    if (!event) {
      return {
        StatusCode: 404,
        error: {
          description: 'Event not found',
        },
      };
    }
    
    return {
      StatusCode: 200,
      data: event,
    };
  }

  static async deleteEvent(data: any) {
    await simulateDelay();
    
    OfflineDB.deleteEvent(data.event_id);
    
    return {
      StatusCode: 200,
      message: 'Event deleted successfully',
    };
  }

  // Gallery operations
  static async addGallery(data: any) {
    await simulateDelay(800);
    
    const gallery = JSON.parse(data.gallery || '[]');
    const galleryData = gallery.map((img: string, idx: number) => ({
      id: Date.now() + idx,
      pic: img,
    }));
    
    OfflineDB.saveEventGallery(data.event_id, galleryData);
    
    return {
      StatusCode: 200,
      data: {
        message: 'Gallery uploaded successfully',
      },
    };
  }

  static async viewGallery(data: any) {
    await simulateDelay();
    
    const gallery = OfflineDB.getEventGallery(data.event_id);
    
    return {
      StatusCode: 200,
      data: {
        gallery,
      },
    };
  }

  // Event config/settings
  static async updateEventConfig(data: any) {
    await simulateDelay();
    
    const event = OfflineDB.getEventById(data.event_id);
    if (event) {
      const updatedConfig = {
        ...event.event_config,
        ...data,
      };
      OfflineDB.updateEvent(data.event_id, { event_config: updatedConfig });
    }
    
    return {
      StatusCode: 200,
      data: {
        message: 'Event settings updated',
      },
    };
  }

  // Guest operations
  static async viewEventGuests(data: any) {
    await simulateDelay();
    
    const guests = OfflineDB.getEventGuests(data.event_id);
    
    // Calculate RSVP counts
    const rsvp_cnt: any = {
      'I~Y': 0,
      'R~Y': 0,
      'R~N': 0,
      'R~M': 0,
    };
    
    guests.forEach((g: any) => {
      if (rsvp_cnt[g.rsvp] !== undefined) {
        rsvp_cnt[g.rsvp]++;
      }
    });
    
    const event = OfflineDB.getEventById(data.event_id);
    
    return {
      StatusCode: 200,
      data: {
        guest_list: guests,
        rsvp_cnt,
        event: event?.event_config || {},
        INVITE_RSVP_DD_ARR: [
          { id: 'I~Y', label: 'Invited' },
          { id: 'R~Y', label: 'Going' },
          { id: 'R~N', label: 'Not Going' },
          { id: 'R~M', label: 'Maybe' },
        ],
      },
    };
  }

  static async addEventGuests(data: any) {
    await simulateDelay(600);
    
    const guests = JSON.parse(data.guests || '[]');
    
    guests.forEach((guest: any) => {
      OfflineDB.addEventGuest(data.event_id, {
        name: guest.name,
        number: guest.number,
        country_code: guest.country_code || '',
        pic: guest.pic || null,
        rsvp: 'I~Y', // Invited
        additional_guests: 0,
      });
    });
    
    return {
      StatusCode: 200,
      data: {
        message: 'Guests added successfully',
      },
    };
  }

  static async updateGuestRSVP(data: any) {
    await simulateDelay();
    
    OfflineDB.updateEventGuest(data.event_id, data.guest_id, {
      rsvp: data.rsvp,
    });
    
    return {
      StatusCode: 200,
      data: {
        message: 'RSVP updated successfully',
      },
    };
  }

  static async deleteEventGuest(data: any) {
    await simulateDelay();
    
    OfflineDB.deleteEventGuest(data.event_id, data.guest_id);
    
    return {
      StatusCode: 200,
      data: {
        message: 'Guest removed successfully',
      },
    };
  }

  static async addGuestSelf(data: any) {
    await simulateDelay();
    
    const user = OfflineDB.getUser();
    const event = OfflineDB.getEventById(data.event_id);
    
    if (event) {
      OfflineDB.updateEvent(data.event_id, {
        is_guest: true,
        rsvp_guest_approved: 'Y',
      });
    }
    
    return {
      StatusCode: 200,
      data: {
        message: 'Added to guest list',
      },
    };
  }

  // Contacts operations
  static async addContacts(data: any) {
    await simulateDelay(500);
    
    const contacts = JSON.parse(data.contacts || '[]');
    OfflineDB.addContacts(contacts);
    
    return {
      StatusCode: 200,
      data: {
        message: 'Contacts added successfully',
      },
    };
  }

  static async viewContacts(data: any) {
    await simulateDelay();
    
    const contacts = OfflineDB.getContacts();
    
    return {
      StatusCode: 200,
      data: {
        contacts,
      },
    };
  }

  // WhatsApp operations (mock)
  static async checkConnection(data: any) {
    await simulateDelay();
    
    return {
      StatusCode: 200,
      data: {
        status: false, // Not connected in offline mode
        interval: 0,
        instance: {
          credits: OfflineDB.getUser().credits,
        },
      },
    };
  }

  static async disconnectConnection(data: any) {
    await simulateDelay();
    
    return {
      StatusCode: 200,
      data: {
        status: false,
        message: 'Disconnected',
      },
    };
  }

  static async getQRMessage(data: any) {
    await simulateDelay();
    
    return {
      StatusCode: 200,
      data: {
        msg_tpl: 'Connect your WhatsApp (Offline Mode)',
      },
    };
  }

  static async sendQREmail(data: any) {
    await simulateDelay();
    
    return {
      StatusCode: 200,
      data: {
        message: 'Email sent successfully (Offline Mode)',
      },
    };
  }

  static async getWhatsAppTemplates(data: any) {
    await simulateDelay();
    
    // Sample WhatsApp message templates by category
    const templates: Record<string, any[]> = {
      wedding: [
        {
          id: 1,
          title: 'Wedding Invitation',
          category: 'Wedding',
          preview: 'You are cordially invited to celebrate our wedding...',
          content: '💍 Wedding Invitation 💍\n\nYou are cordially invited to celebrate the wedding of\n[Bride] & [Groom]\n\nDate: [Date]\nTime: [Time]\nVenue: [Location]\n\nYour presence will make our day special!\n\nRSVP: [Link]',
        },
        {
          id: 2,
          title: 'Wedding Reminder',
          category: 'Wedding',
          preview: 'Reminder: Our wedding is just around the corner...',
          content: '💐 Wedding Reminder 💐\n\nDear [Name],\n\nThis is a gentle reminder that our wedding is on [Date] at [Time].\n\nVenue: [Location]\n\nWe look forward to celebrating with you!\n\nRSVP: [Link]',
        },
        {
          id: 3,
          title: 'Wedding Thank You',
          category: 'Wedding',
          preview: 'Thank you for being part of our special day...',
          content: '💝 Thank You 💝\n\nDear [Name],\n\nThank you for being part of our special day and making it memorable!\n\nYour presence and blessings mean the world to us.\n\nWith love,\n[Bride] & [Groom]',
        },
      ],
      birthday: [
        {
          id: 4,
          title: 'Birthday Party Invitation',
          category: 'Birthday',
          preview: 'Join us for a birthday celebration...',
          content: '🎂 Birthday Party Invitation 🎉\n\nYou\'re invited to celebrate [Name]\'s birthday!\n\nDate: [Date]\nTime: [Time]\nVenue: [Location]\n\nLet\'s make it a day to remember!\n\nRSVP: [Link]',
        },
        {
          id: 5,
          title: 'Birthday Reminder',
          category: 'Birthday',
          preview: 'Don\'t forget the birthday party...',
          content: '🎈 Birthday Reminder 🎈\n\nHey [Name]!\n\nJust a reminder about the birthday party on [Date] at [Time].\n\nVenue: [Location]\n\nSee you there!\n\nRSVP: [Link]',
        },
        {
          id: 6,
          title: 'Birthday Thank You',
          category: 'Birthday',
          preview: 'Thanks for celebrating with us...',
          content: '🎁 Thank You 🎁\n\nDear [Name],\n\nThank you for making the birthday celebration so special!\n\nYour presence and wishes made the day perfect.\n\nWith gratitude,\n[Host Name]',
        },
      ],
      business: [
        {
          id: 7,
          title: 'Business Event Invitation',
          category: 'Business Party',
          preview: 'You are invited to our business event...',
          content: '📊 Business Event Invitation 📊\n\nDear [Name],\n\nYou are cordially invited to our business event.\n\nDate: [Date]\nTime: [Time]\nVenue: [Location]\n\nAgenda: [Details]\n\nRSVP: [Link]',
        },
        {
          id: 8,
          title: 'Networking Event',
          category: 'Business Party',
          preview: 'Join us for a networking evening...',
          content: '🤝 Networking Event 🤝\n\nDear [Name],\n\nJoin us for an evening of networking and collaboration.\n\nDate: [Date]\nTime: [Time]\nVenue: [Location]\n\nConnect with industry leaders!\n\nRSVP: [Link]',
        },
        {
          id: 9,
          title: 'Corporate Celebration',
          category: 'Business Party',
          preview: 'Celebrate our success together...',
          content: '🎊 Corporate Celebration 🎊\n\nDear Team,\n\nLet\'s celebrate our achievements together!\n\nDate: [Date]\nTime: [Time]\nVenue: [Location]\n\nYour contribution matters!\n\nRSVP: [Link]',
        },
      ],
      gettogether: [
        {
          id: 10,
          title: 'Casual Get Together',
          category: 'Get together',
          preview: 'Let\'s catch up over food and fun...',
          content: '🎉 Get Together Invitation 🎉\n\nHey [Name]!\n\nLet\'s catch up over food and fun!\n\nDate: [Date]\nTime: [Time]\nVenue: [Location]\n\nBring your good vibes!\n\nRSVP: [Link]',
        },
        {
          id: 11,
          title: 'Family Reunion',
          category: 'Get together',
          preview: 'Family reunion - let\'s reconnect...',
          content: '👨‍👩‍👧‍👦 Family Reunion 👨‍👩‍👧‍👦\n\nDear Family,\n\nLet\'s reconnect and create new memories!\n\nDate: [Date]\nTime: [Time]\nVenue: [Location]\n\nAll family members welcome!\n\nRSVP: [Link]',
        },
        {
          id: 12,
          title: 'Friends Meetup',
          category: 'Get together',
          preview: 'Friends meetup - let\'s hang out...',
          content: '🎮 Friends Meetup 🎮\n\nHey [Name]!\n\nLet\'s hang out and have some fun!\n\nDate: [Date]\nTime: [Time]\nVenue: [Location]\n\nGames, food, and good times!\n\nRSVP: [Link]',
        },
      ],
    };
    
    // Filter by category if provided
    const category = data.category?.toLowerCase();
    let filteredTemplates: any[] = [];
    
    if (category && templates[category]) {
      filteredTemplates = templates[category];
    } else {
      // Return all templates
      filteredTemplates = [
        ...templates.wedding,
        ...templates.birthday,
        ...templates.business,
        ...templates.gettogether,
      ];
    }
    
    return {
      StatusCode: 200,
      data: {
        templates: filteredTemplates,
        categories: [
          { id: 1, title: 'Wedding', key: 'wedding' },
          { id: 2, title: 'Birthday', key: 'birthday' },
          { id: 3, title: 'Business Party', key: 'business' },
          { id: 4, title: 'Get together', key: 'gettogether' },
        ],
      },
    };
  }

  static async sendWhatsAppMessage(data: any) {
    await simulateDelay(1000);
    
    return {
      StatusCode: 200,
      data: {
        message: 'Messages sent successfully (Offline Mode)',
        sent_count: data.guest_ids?.length || 0,
      },
    };
  }

  // Comments operations
  static async viewMessages(data: any) {
    await simulateDelay();
    
    const comments = OfflineDB.getEventComments(data.event_id);
    
    // Format comments to match API response
    const msg_list = comments.map((comment: any) => ({
      msg_id: comment.id,
      text: comment.text,
      pic: comment.image || null,
      date_time: comment.created_at,
      author: {
        name: comment.user_name,
        pic: comment.user_pic,
        rsvp: 'Y',
      },
    }));
    
    return {
      StatusCode: 200,
      data: {
        msg_list,
      },
    };
  }

  static async addMessage(data: any) {
    await simulateDelay();
    
    const user = OfflineDB.getUser();
    const comment = OfflineDB.addEventComment(data.event_id, {
      text: data.text,
      image: data.pic || null,
      user_id: user.id,
      user_name: user.name,
      user_pic: user.pic,
    });
    
    return {
      StatusCode: 200,
      data: {
        msg_list: [],
        message: 'Message added successfully',
      },
    };
  }

  static async viewEventConfig(data: any) {
    await simulateDelay();
    
    const event = OfflineDB.getEventById(data.event_id);
    
    if (!event) {
      return {
        StatusCode: 404,
        error: {
          description: 'Event not found',
        },
      };
    }
    
    return {
      StatusCode: 200,
      data: event.event_config || {
        published: 'Y',
        rsvp_url: '',
        accept_rsvp: 'Y',
        accept_maybe: 'Y',
        rsvp_button_style: 0,
        show_count_guests: 'Y',
        open_event: 'N',
        max_capacity: 0,
        guest_approval: 'N',
        additional_guests: 0,
        activity_timeline: 'Y',
        guest_status_share: 'Y',
        guest_posts: 'Y',
        guest_upload: 'Y',
      },
    };
  }

  // Questions operations
  static async getQuestions(data: any) {
    await simulateDelay();
    
    const questions = OfflineDB.getEventQuestions(data.event_id);
    
    return {
      StatusCode: 200,
      data: {
        questions,
      },
    };
  }

  static async addQuestion(data: any) {
    await simulateDelay();
    
    const question = OfflineDB.addEventQuestion(data.event_id, {
      question: data.question,
      type: data.type || 'text',
      choices: data.choices || [],
      responses: [],
    });
    
    return {
      StatusCode: 200,
      data: {
        question,
        message: 'Question added',
      },
    };
  }
}
