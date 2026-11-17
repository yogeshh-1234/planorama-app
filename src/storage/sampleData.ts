import { OfflineDB } from './offlineDB';

export class SampleDataGenerator {
  static generateSampleEvents() {
    const events = [
      {
        name: 'New Year Celebration 2026',
        title: 'New Year Celebration 2026',
        font_id: '1',
        cover_img: 'https://images.unsplash.com/photo-1467810563316-b5476525c0f9?w=500',
        bg_img: '',
        color_hex: '#1a1a2e',
        date: '31/12/2025',
        time: '20:00',
        type: 'off',
        location: 'Grand Hotel, Downtown',
        link: '',
        event_disc: 'Join us for an unforgettable New Year celebration with music, dance, and fireworks!',
        rsvp: 'Y',
        published: 'Y',
        is_host: true,
        is_guest: false,
        host_list: [{
          id: '1',
          name: 'Demo User',
          pic: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&h=400&fit=crop',
        }],
        event_config: {
          published: 'Y',
          rsvp_url: `https://planorama.in/e/${Date.now()}`,
          accept_rsvp: 'Y',
          accept_maybe: 'Y',
          rsvp_button_style: 0,
          show_count_guests: 'Y',
          open_event: 'N',
          max_capacity: 100,
          guest_approval: 'N',
          additional_guests: 2,
          activity_timeline: 'Y',
          guest_status_share: 'Y',
          guest_posts: 'Y',
          guest_upload: 'Y',
        },
        rsvp_url: `https://planorama.in/e/${Date.now()}`,
        rsvp_guest_type: 'H',
        rsvp_guest_approved: 'Y',
      },
      {
        name: 'Christmas Party 2025',
        title: 'Christmas Party 2025',
        font_id: '2',
        cover_img: 'https://images.unsplash.com/photo-1512389142860-9c449e58a543?w=500',
        bg_img: '',
        color_hex: '#c41e3a',
        date: '25/12/2025',
        time: '18:00',
        type: 'off',
        location: 'Community Center',
        link: '',
        event_disc: 'Celebrate Christmas with family and friends. Secret Santa, games, and delicious food!',
        rsvp: 'Y',
        published: 'Y',
        is_host: true,
        is_guest: false,
        host_list: [{
          id: '1',
          name: 'Demo User',
          pic: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&h=400&fit=crop',
        }],
        event_config: {
          published: 'Y',
          rsvp_url: `https://planorama.in/e/${Date.now() + 1}`,
          accept_rsvp: 'Y',
          accept_maybe: 'Y',
          rsvp_button_style: 0,
          show_count_guests: 'Y',
          open_event: 'N',
          max_capacity: 50,
          guest_approval: 'N',
          additional_guests: 1,
          activity_timeline: 'Y',
          guest_status_share: 'Y',
          guest_posts: 'Y',
          guest_upload: 'Y',
        },
        rsvp_url: `https://planorama.in/e/${Date.now() + 1}`,
        rsvp_guest_type: 'H',
        rsvp_guest_approved: 'Y',
      },
      {
        name: 'Birthday Bash',
        title: 'Birthday Bash',
        font_id: '3',
        cover_img: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=500',
        bg_img: '',
        color_hex: '#ff6b9d',
        date: '15/12/2025',
        time: '19:00',
        type: 'off',
        location: 'Home Sweet Home',
        link: '',
        event_disc: 'Celebrating another year of life! Come join the fun with cake, music, and great company.',
        rsvp: 'Y',
        published: 'Y',
        is_host: true,
        is_guest: false,
        host_list: [{
          id: '1',
          name: 'Demo User',
          pic: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&h=400&fit=crop',
        }],
        event_config: {
          published: 'Y',
          rsvp_url: `https://planorama.in/e/${Date.now() + 2}`,
          accept_rsvp: 'Y',
          accept_maybe: 'Y',
          rsvp_button_style: 0,
          show_count_guests: 'Y',
          open_event: 'N',
          max_capacity: 30,
          guest_approval: 'N',
          additional_guests: 1,
          activity_timeline: 'Y',
          guest_status_share: 'Y',
          guest_posts: 'Y',
          guest_upload: 'Y',
        },
        rsvp_url: `https://planorama.in/e/${Date.now() + 2}`,
        rsvp_guest_type: 'H',
        rsvp_guest_approved: 'Y',
      },
      {
        name: 'Team Building Workshop',
        title: 'Team Building Workshop',
        font_id: '1',
        cover_img: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=500',
        bg_img: '',
        color_hex: '#2c3e50',
        date: '20/11/2025',
        time: '10:00',
        type: 'on',
        location: '',
        link: 'https://zoom.us/j/123456789',
        event_disc: 'Virtual team building activities and workshops to strengthen our team bonds.',
        rsvp: 'M',
        published: 'Y',
        is_host: false,
        is_guest: true,
        host_list: [{
          id: '2',
          name: 'Team Lead',
          pic: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop',
        }],
        event_config: {
          published: 'Y',
          rsvp_url: `https://planorama.in/e/${Date.now() + 3}`,
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
        rsvp_url: `https://planorama.in/e/${Date.now() + 3}`,
        rsvp_guest_type: 'G',
        rsvp_guest_approved: 'Y',
        rsvp_guest_id: 1,
      },
      {
        name: 'Summer BBQ 2024',
        title: 'Summer BBQ 2024',
        font_id: '4',
        cover_img: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=500',
        bg_img: '',
        color_hex: '#f39c12',
        date: '15/08/2024',
        time: '17:00',
        type: 'off',
        location: 'Backyard Paradise',
        link: '',
        event_disc: 'A fun summer BBQ with grilled favorites, cold drinks, and outdoor games!',
        rsvp: 'Y',
        published: 'Y',
        is_host: true,
        is_guest: false,
        host_list: [{
          id: '1',
          name: 'Demo User',
          pic: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&h=400&fit=crop',
        }],
        event_config: {
          published: 'Y',
          rsvp_url: `https://planorama.in/e/${Date.now() + 4}`,
          accept_rsvp: 'Y',
          accept_maybe: 'Y',
          rsvp_button_style: 0,
          show_count_guests: 'Y',
          open_event: 'N',
          max_capacity: 40,
          guest_approval: 'N',
          additional_guests: 2,
          activity_timeline: 'Y',
          guest_status_share: 'Y',
          guest_posts: 'Y',
          guest_upload: 'Y',
        },
        rsvp_url: `https://planorama.in/e/${Date.now() + 4}`,
        rsvp_guest_type: 'H',
        rsvp_guest_approved: 'Y',
      },
    ];

    // Save events
    events.forEach(event => {
      OfflineDB.addEvent(event);
    });
  }

  static generateSampleGuests(eventId: number) {
    const guests = [
      {
        name: 'John Doe',
        number: '9876543210',
        country_code: '91',
        pic: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop',
        rsvp: 'R~Y',
        additional_guests: 1,
      },
      {
        name: 'Jane Smith',
        number: '9876543211',
        country_code: '91',
        pic: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
        rsvp: 'R~Y',
        additional_guests: 0,
      },
      {
        name: 'Mike Johnson',
        number: '9876543212',
        country_code: '91',
        pic: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
        rsvp: 'R~M',
        additional_guests: 0,
      },
      {
        name: 'Sarah Williams',
        number: '9876543213',
        country_code: '91',
        pic: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop',
        rsvp: 'I~Y',
        additional_guests: 0,
      },
      {
        name: 'David Brown',
        number: '9876543214',
        country_code: '91',
        pic: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop',
        rsvp: 'R~N',
        additional_guests: 0,
      },
    ];

    guests.forEach(guest => {
      OfflineDB.addEventGuest(eventId, guest);
    });
  }

  static generateSampleContacts() {
    const contacts = [
      { name: 'Alice Cooper', number: '9876543220', country_code: '91', pic: null },
      { name: 'Bob Martin', number: '9876543221', country_code: '91', pic: null },
      { name: 'Charlie Davis', number: '9876543222', country_code: '91', pic: null },
      { name: 'Diana Prince', number: '9876543223', country_code: '91', pic: null },
      { name: 'Edward Norton', number: '9876543224', country_code: '91', pic: null },
      { name: 'Fiona Apple', number: '9876543225', country_code: '91', pic: null },
      { name: 'George Lucas', number: '9876543226', country_code: '91', pic: null },
      { name: 'Hannah Montana', number: '9876543227', country_code: '91', pic: null },
    ];

    OfflineDB.addContacts(contacts);
  }

  static generateSampleGallery(eventId: number) {
    const gallery = [
      'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=500',
      'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=500',
      'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=500',
      'https://images.unsplash.com/photo-1505236858219-8359eb29e329?w=500',
    ];

    const galleryData = gallery.map((img, idx) => ({
      id: Date.now() + idx,
      pic: img,
    }));

    OfflineDB.saveEventGallery(eventId, galleryData);
  }

  static generateSampleComments(eventId: number) {
    const comments = [
      {
        text: 'So excited for this event! 🎉',
        image: null,
        user_id: '2',
        user_name: 'John Doe',
        user_pic: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop',
      },
      {
        text: 'Can\'t wait to see everyone there!',
        image: null,
        user_id: '3',
        user_name: 'Jane Smith',
        user_pic: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
      },
      {
        text: 'This is going to be amazing! 🔥',
        image: null,
        user_id: '4',
        user_name: 'Mike Johnson',
        user_pic: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
      },
      {
        text: 'Looking forward to it! See you all there! 😊',
        image: null,
        user_id: '5',
        user_name: 'Sarah Williams',
        user_pic: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop',
      },
      {
        text: 'Count me in! This will be epic! 🎊',
        image: null,
        user_id: '6',
        user_name: 'David Brown',
        user_pic: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop',
      },
    ];

    comments.forEach(comment => {
      OfflineDB.addEventComment(eventId, comment);
    });
  }

  static initializeAllSampleData() {
    // Check if already initialized
    if (OfflineDB.getEvents().length > 0) {
      return; // Already has data
    }

    // Generate sample events
    this.generateSampleEvents();

    // Get first event and add sample data
    const events = OfflineDB.getEvents();
    if (events.length > 0) {
      const firstEventId = events[0].evt_id;
      this.generateSampleGuests(firstEventId);
      this.generateSampleGallery(firstEventId);
      this.generateSampleComments(firstEventId);
    }

    // Generate sample contacts
    this.generateSampleContacts();
  }
}
