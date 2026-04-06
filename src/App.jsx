import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { UserPlus, Calendar, Trash2, Edit2, X, Plus, Home, UserCircle, Network, ChevronDown, MoreVertical, Phone, Mail, Bell, Check, CheckCircle, Cake, ArrowUp, ArrowDown, Download, Upload, Menu, Search, Sun, Moon } from 'lucide-react';

// Google G icon
function GoogleIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );
}

// Smart dropdown that positions itself to avoid viewport clipping
function SmartDropdown({ anchorRect, open, onClose, children }) {
  const [style, setStyle] = useState({});

  useEffect(() => {
    if (!open || !anchorRect) return;
    const dropHeight = 240;
    const dropWidth = 160;
    const spaceBelow = window.innerHeight - anchorRect.bottom;
    const spaceAbove = anchorRect.top;
    const top = spaceBelow >= dropHeight || spaceBelow >= spaceAbove
      ? anchorRect.bottom + 4
      : anchorRect.top - dropHeight - 4;
    const left = Math.min(anchorRect.right - dropWidth, window.innerWidth - dropWidth - 8);
    setStyle({ position: 'fixed', top, left, zIndex: 9999, minWidth: `${dropWidth}px` });
  }, [open, anchorRect]);

  if (!open) return null;
  return (
    <>
      <div className="fixed inset-0" style={{ zIndex: 9998 }} onClick={onClose} />
      <div style={style} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg overflow-hidden">
        {children}
      </div>
    </>
  );
}


export default function UnGhost() {
  const [friends, setFriends] = useState([]);
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState('all');
  const [friendsSearch, setFriendsSearch] = useState('');
  const [friendsSortBy, setFriendsSortBy] = useState('name');
  const [friendsSortOrder, setFriendsSortOrder] = useState('asc');
  const [groupsSearch, setGroupsSearch] = useState('');
  const [groupsSort, setGroupsSort] = useState('name');
  const [groupsSortBy, setGroupsSortBy] = useState('name');
  const [groupsSortOrder, setGroupsSortOrder] = useState('asc');
  const [currentView, setCurrentView] = useState('home');
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [viewingFriendId, setViewingFriendId] = useState(null);
  const viewingFriend = useMemo(() => friends.find(f => f.id === viewingFriendId) || null, [friends, viewingFriendId]);
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [showEditGroupModal, setShowEditGroupModal] = useState(false);
  const [editingGroup, setEditingGroup] = useState(null);
  const [groupActionsOpen, setGroupActionsOpen] = useState(null);
  const [reminderMenuOpen, setReminderMenuOpen] = useState(null);
  const [reminderMenuRect, setReminderMenuRect] = useState(null);
  const [eventMenuOpen, setEventMenuOpen] = useState(null);
  const [eventMenuRect, setEventMenuRect] = useState(null);
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupDescription, setNewGroupDescription] = useState('');
  const [newGroupColor, setNewGroupColor] = useState('');
  const [newGroupIcon, setNewGroupIcon] = useState('');
  const [newGroupMembers, setNewGroupMembers] = useState([]);
  const [showCheckInModal, setShowCheckInModal] = useState(false);
  const [modalType, setModalType] = useState('event');
  const [editingReminder, setEditingReminder] = useState(null);
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurringPeriod, setRecurringPeriod] = useState(7);
  const [showEditCheckInModal, setShowEditCheckInModal] = useState(false);
  const [editingCheckIn, setEditingCheckIn] = useState(null);
  const [checkInTitle, setCheckInTitle] = useState('');
  const [checkInNote, setCheckInNote] = useState('');
  const [checkInDate, setCheckInDate] = useState(toLocalDateStr());
  const [taggedFriends, setTaggedFriends] = useState([]);
  const [showGlobalLogModal, setShowGlobalLogModal] = useState(false);
  const [globalLogTitle, setGlobalLogTitle] = useState('');
  const [globalLogNote, setGlobalLogNote] = useState('');
  const [globalLogDate, setGlobalLogDate] = useState(toLocalDateStr());
  const [globalLogFriends, setGlobalLogFriends] = useState([]);
  const [globalLogSearch, setGlobalLogSearch] = useState('');
  const [isEditingFriend, setIsEditingFriend] = useState(false);
  const [detailTab, setDetailTab] = useState('profile');
  const [editedFriend, setEditedFriend] = useState(null);
  const [showFrequencyDropdown, setShowFrequencyDropdown] = useState(false);
  const [showGroupDropdown, setShowGroupDropdown] = useState(false);
  const [showEditFrequencyDropdown, setShowEditFrequencyDropdown] = useState(false);
  const [showEditGroupDropdown, setShowEditGroupDropdown] = useState(false);
  const [showGroupFilterDropdown, setShowGroupFilterDropdown] = useState(false);
  const [showImportExportDropdown, setShowImportExportDropdown] = useState(false);
  const [quickAddGroupFriendId, setQuickAddGroupFriendId] = useState(null);
  const [showAddFriendModal, setShowAddFriendModal] = useState(false);
  const [showEventsGroupFilter, setShowEventsGroupFilter] = useState(false);
  const [eventActionsOpen, setEventActionsOpen] = useState(null);
  const [eventActionsRect, setEventActionsRect] = useState(null);
  const [eventsFriendFilter, setEventsFriendFilter] = useState('all');
  const [eventsDateRange, setEventsDateRange] = useState('all');
  const [showEventsFriendFilter, setShowEventsFriendFilter] = useState(false);
  const [showEventsDateFilter, setShowEventsDateFilter] = useState(false);
  const [eventsFriendFilterRect, setEventsFriendFilterRect] = useState(null);
  const [eventsDateFilterRect, setEventsDateFilterRect] = useState(null);
  const [editCheckInFriendSearch, setEditCheckInFriendSearch] = useState('');
  const [taggedFriendsSearch, setTaggedFriendsSearch] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isDark, setIsDark] = useState(() => localStorage.getItem('unghost-theme') === 'dark');
  const [googleUser, setGoogleUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('unghost-google-user')); } catch { return null; }
  });
  const [likesInput, setLikesInput] = useState('');
  const [hoveredFriendId, setHoveredFriendId] = useState(null);
  const [groupMemberSearch, setGroupMemberSearch] = useState('');
  const groupFilterRef = useRef(null);
  const importExportRef = useRef(null);

  const [groupFilterRect, setGroupFilterRect] = useState(null);
  const [importExportRect, setImportExportRect] = useState(null);
  const [groupActionsRect, setGroupActionsRect] = useState(null);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [newFriend, setNewFriend] = useState({
    firstName: '',
    lastName: '',
    frequency: 14,
    groups: [],
    phone: '',
    email: '',
    birthday: ''
  });

  const groupColorPresets = [
    '#3B82F6','#10B981','#8B5CF6','#F59E0B','#EF4444','#EC4899','#14B8A6','#F97316',
  ];
  const groupIconPresets = ['👥', '💼', '🎓', '❤️', '🏠', '🎮', '⚽', '🎨', '🎵', '✈️', '🍕', '💪'];

  // Google Sign-In (GIS)
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.onload = () => {
      window.google?.accounts.id.initialize({
        client_id: '487139970331-s8jtj0lio0fn0plegumqmfsg0bsrrd8t.apps.googleusercontent.com',
        callback: (response) => {
          const payload = JSON.parse(atob(response.credential.split('.')[1]));
          const user = { name: payload.name, email: payload.email, picture: payload.picture };
          setGoogleUser(user);
          localStorage.setItem('unghost-google-user', JSON.stringify(user));
        },
      });
    };
    document.head.appendChild(script);
    return () => { if (document.head.contains(script)) document.head.removeChild(script); };
  }, []);

  const handleGoogleSignIn = useCallback(() => {
    window.google?.accounts.id.prompt();
  }, []);

  const handleGoogleSignOut = useCallback(() => {
    window.google?.accounts.id.disableAutoSelect();
    setGoogleUser(null);
    localStorage.removeItem('unghost-google-user');
  }, []);

  useEffect(() => {
    async function loadData() {
      let loadedGroups = [];
      let loadedFriends = [];

      // Try window.storage first (single combined key)
      try {
        const result = await window.storage.get('unghost-data');
        if (result && result.value) {
          const parsed = JSON.parse(result.value);
          loadedGroups = parsed.groups || [];
          loadedFriends = parsed.friends || [];
        }
      } catch (e) {
        // Fallback to localStorage
        try {
          const stored = localStorage.getItem('unghost-data');
          if (stored) {
            const parsed = JSON.parse(stored);
            loadedGroups = parsed.groups || [];
            loadedFriends = parsed.friends || [];
          }
        } catch (e2) {}
      }

      // Migrate old separate keys if combined key is empty
      if (loadedGroups.length === 0 && loadedFriends.length === 0) {
        try {
          const gResult = await window.storage.get('unghost-groups');
          const fResult = await window.storage.get('unghost-friends');
          if (gResult?.value) loadedGroups = JSON.parse(gResult.value);
          if (fResult?.value) loadedFriends = JSON.parse(fResult.value);
        } catch (e) {}
      }

      // Migrate old string-based groups
      if (loadedGroups.length > 0 && typeof loadedGroups[0] === 'string') {
        const timestamp = Date.now();
        loadedGroups = loadedGroups.map((groupName, index) => ({
          id: (timestamp + index).toString(),
          name: groupName,
          description: '',
          color: groupColorPresets[Math.floor(Math.random() * groupColorPresets.length)],
          icon: groupIconPresets[Math.floor(Math.random() * groupIconPresets.length)],
          createdAt: new Date().toISOString()
        }));
      }

      // Migrate old string-based friend groups (names → IDs)
      loadedFriends = loadedFriends.map(friend => {
        if (friend.groups && friend.groups.length > 0 && typeof friend.groups[0] === 'string') {
          const alreadyIds = loadedGroups.some(g => g.id === friend.groups[0]);
          if (alreadyIds) return friend;
          const groupIds = friend.groups.map(groupName => loadedGroups.find(g => g.name === groupName)?.id).filter(Boolean);
          return { ...friend, groups: groupIds };
        }
        return friend;
      });

      setGroups(loadedGroups);
      setFriends(loadedFriends);
      setDataLoaded(true);
    }
    loadData();
  }, []);

  useEffect(() => {
    if (!dataLoaded) return;
    const timer = setTimeout(async () => {
      const data = JSON.stringify({ friends, groups });
      console.log('Attempting save... friends:', friends.length, 'groups:', groups.length);
      let saved = false;
      try {
        const result = await window.storage.set('unghost-data', data);
        console.log('window.storage.set result:', result);
        if (result) saved = true;
      } catch (e) {
        console.log('window.storage.set error:', e);
      }
      if (!saved) {
        try { localStorage.setItem('unghost-data', data); saved = true; console.log('localStorage save succeeded'); } catch (e) { console.log('localStorage error:', e); }
      }
      console.log('Save completed, saved:', saved);
    }, 500);
    return () => clearTimeout(timer);
  }, [friends, groups, dataLoaded]);

  useEffect(() => {
    localStorage.setItem('unghost-theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  // Parse YYYY-MM-DD date strings as local time (not UTC) to avoid day-shift bugs
  function parseLocalDate(dateStr) {
    if (!dateStr) return new Date();
    // If it's already a full ISO string with time, parse normally
    if (dateStr.includes('T')) return new Date(dateStr);
    // For YYYY-MM-DD, parse as local midnight
    const [year, month, day] = dateStr.split('-').map(Number);
    return new Date(year, month - 1, day);
  }

  function toLocalDateStr(date) {
    const d = date || new Date();
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
  }

  function getRelativeDateLabel(date) {
    const todayStr = toLocalDateStr(new Date());
    const dateStr = toLocalDateStr(date);
    const yesterday = new Date(); yesterday.setDate(yesterday.getDate() - 1);
    const tomorrow = new Date(); tomorrow.setDate(tomorrow.getDate() + 1);
    if (dateStr === todayStr) return 'Today';
    if (dateStr === toLocalDateStr(yesterday)) return 'Yesterday';
    if (dateStr === toLocalDateStr(tomorrow)) return 'Tomorrow';
    return null;
  }

  function createGroup(name, description = '', color = null, icon = null) {
    return {
      id: Date.now().toString(),
      name,
      description,
      color: color || groupColorPresets[Math.floor(Math.random() * groupColorPresets.length)],
      icon: icon || groupIconPresets[Math.floor(Math.random() * groupIconPresets.length)],
      createdAt: new Date().toISOString()
    };
  }

  function getGroupById(groupId) { return groups.find(g => g.id === groupId); }

  function addFriend() {
    if (!newFriend.firstName.trim()) return;
    const friend = {
      id: Date.now().toString(),
      name: `${newFriend.firstName} ${newFriend.lastName}`.trim(),
      ...newFriend,
      reminders: [],
      eventLog: [{ id: Date.now().toString(), date: new Date().toISOString(), title: 'Added to UnGhost', note: '', type: 'system' }]
    };
    setFriends([...friends, friend]);
    setNewFriend({ firstName: '', lastName: '', frequency: 14, groups: [], phone: '', email: '' });
    setShowAddFriendModal(false);
  }

  function saveEditedFriend() {
    if (!editedFriend.firstName.trim()) return;
    const updatedFriend = { ...editedFriend, name: `${editedFriend.firstName} ${editedFriend.lastName}`.trim() };
    setFriends(friends.map(f => f.id === updatedFriend.id ? updatedFriend : f));
    setIsEditingFriend(false);
    setEditedFriend(null);
  }

  function quickToggleGroup(friendId, groupId) {
    setFriends(prevFriends => prevFriends.map(f => {
      if (f.id !== friendId) return f;
      const currentGroups = f.groups || [];
      const newGroups = currentGroups.includes(groupId) ? currentGroups.filter(gId => gId !== groupId) : [...currentGroups, groupId];
      return { ...f, groups: newGroups };
    }));
  }

  function exportFriends() {
    const dataToExport = { friends, groups, exportDate: new Date().toISOString(), version: '1.0' };
    const dataStr = JSON.stringify(dataToExport, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `unghost-backup-${toLocalDateStr()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  function importFriends(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const imported = JSON.parse(e.target.result);
        if (!imported.friends || !imported.groups) { alert('Invalid backup file format'); return; }
        const existingGroupIds = new Set(groups.map(g => g.id));
        const newGroups = imported.groups.filter(g => !existingGroupIds.has(g.id));
        const mergedGroups = [...groups, ...newGroups];
        const existingFriendIds = new Set(friends.map(f => f.id));
        const friendsToAdd = imported.friends.filter(f => !existingFriendIds.has(f.id));
        const friendsToUpdate = imported.friends.filter(f => existingFriendIds.has(f.id));
        const updatedFriends = friends.map(f => { const imp = friendsToUpdate.find(i => i.id === f.id); return imp || f; });
        const mergedFriends = [...updatedFriends, ...friendsToAdd];
        setGroups(mergedGroups);
        setFriends(mergedFriends);
        // Save atomically so the useEffect race condition can't overwrite with stale state
        await window.storage.set('unghost-groups', JSON.stringify(mergedGroups));
        await window.storage.set('unghost-friends', JSON.stringify(mergedFriends));
        alert(`Import successful!\nAdded: ${friendsToAdd.length + newGroups.length} items\nUpdated: ${friendsToUpdate.length} friends`);
      } catch (error) { alert('Error reading backup file.'); }
    };
    reader.readAsText(file);
    event.target.value = '';
  }

  function addGroup() {
    if (newGroupName && newGroupName.trim() && !groups.find(g => g.name === newGroupName.trim())) {
      const newGroup = createGroup(newGroupName.trim(), newGroupDescription.trim(), newGroupColor || null, newGroupIcon || null);
      setGroups([...groups, newGroup]);
      if (newGroupMembers.length > 0) {
        setFriends(friends.map(f => newGroupMembers.includes(f.id) ? { ...f, groups: [...(f.groups || []), newGroup.id] } : f));
      }
      setNewGroupName(''); setNewGroupDescription(''); setNewGroupColor(''); setNewGroupIcon(''); setNewGroupMembers([]); setGroupMemberSearch('');
      setShowGroupModal(false);
    }
  }

  function saveEditGroup() {
    if (!editingGroup) return;
    setGroups(groups.map(g => g.id === editingGroup.id ? editingGroup : g));
    setShowEditGroupModal(false); setEditingGroup(null);
  }

  function addReminder(friendId, title, date, isRecurring, recurringPeriod) {
    const reminder = { id: Date.now().toString(), title: title || 'Check in', date, isRecurring: isRecurring || false, recurringPeriod: recurringPeriod || 0, isCompleted: false };
    const updatedFriends = friends.map(f => f.id === friendId ? { ...f, reminders: [...(f.reminders || []), reminder] } : f);
    setFriends(updatedFriends);
    setCheckInTitle(''); setCheckInNote(''); setCheckInDate(toLocalDateStr()); setShowCheckInModal(false);
  }

  function updateReminder(friendId, reminderId, title, date, isRecurring, recurringPeriod) {
    setFriends(friends.map(f => f.id === friendId ? {
      ...f,
      reminders: (f.reminders || []).map(r => r.id === reminderId
        ? { ...r, title: title || 'Check in', date, isRecurring: isRecurring || false, recurringPeriod: recurringPeriod || 0 }
        : r)
    } : f));
    setEditingReminder(null);
    setShowCheckInModal(false);
    setCheckInTitle(''); setCheckInNote(''); setCheckInDate(toLocalDateStr()); setIsRecurring(false); setRecurringPeriod(7);
  }

  function completeReminder(friendId, reminderId, shouldLogEvent = true, eventNote = '') {
    const updatedFriends = friends.map(f => {
      if (f.id !== friendId) return f;
      const reminder = f.reminders?.find(r => r.id === reminderId);
      if (!reminder) return f;
      let newReminders = f.reminders.filter(r => r.id !== reminderId);
      let newEventLog = f.eventLog || [];
      if (shouldLogEvent) {
        newEventLog = [...newEventLog, { id: Date.now().toString(), date: new Date().toISOString(), title: reminder.title, note: eventNote, type: 'reminder_completed', reminderId }];
      }
      if (reminder.isRecurring && reminder.recurringPeriod > 0) {
        const nextDate = parseLocalDate(reminder.date);
        nextDate.setDate(nextDate.getDate() + reminder.recurringPeriod);
        newReminders = [...newReminders, { id: Date.now().toString() + '_next', title: reminder.title, date: nextDate.toISOString(), isRecurring: true, recurringPeriod: reminder.recurringPeriod, isCompleted: false }];
      }
      return { ...f, reminders: newReminders, eventLog: newEventLog };
    });
    setFriends(updatedFriends);
  }

  function logEvent(friendIds, title, note, date, additionalTaggedFriends = []) {
    const idsArray = Array.isArray(friendIds) ? friendIds : [friendIds];
    const allFriendIds = [...new Set([...idsArray, ...additionalTaggedFriends])];
    const event = { id: Date.now().toString(), date: date || new Date().toISOString(), title: title || 'Touchpoint', note: note || '', type: 'manual', taggedFriendIds: allFriendIds };
    const updatedFriends = friends.map(f => allFriendIds.includes(f.id) ? { ...f, eventLog: [...(f.eventLog || []), event] } : f);
    setFriends(updatedFriends);
  }

  function updateEvent(eventId, newTitle, newNote, newDate, newFriendIds) {
    const oldFriendIds = friends.filter(f => f.eventLog?.some(e => e.id === eventId)).map(f => f.id);
    const allIds = [...new Set([...oldFriendIds, ...(newFriendIds || [])])];
    const updatedFriends = friends.map(f => {
      const wasTagged = oldFriendIds.includes(f.id);
      const shouldBeTagged = (newFriendIds || oldFriendIds).includes(f.id);
      if (!wasTagged && !shouldBeTagged) return f;
      if (wasTagged && !shouldBeTagged) {
        // Remove event from this friend
        return { ...f, eventLog: f.eventLog?.filter(e => e.id !== eventId) || [] };
      }
      if (!wasTagged && shouldBeTagged) {
        // Add event to this new friend
        const event = friends.flatMap(fr => fr.eventLog || []).find(e => e.id === eventId);
        if (!event) return f;
        return { ...f, eventLog: [...(f.eventLog || []), { ...event, title: newTitle, note: newNote, date: newDate || event.date, taggedFriendIds: newFriendIds || oldFriendIds }] };
      }
      // Update event for existing tagged friend
      const updatedLog = f.eventLog?.map(e => e.id === eventId ? { ...e, title: newTitle, note: newNote, date: newDate || e.date, taggedFriendIds: newFriendIds || oldFriendIds } : e);
      return { ...f, eventLog: updatedLog };
    });
    setFriends(updatedFriends);
    setShowEditCheckInModal(false); setEditingCheckIn(null);
  }

  function deleteEvent(friendId, eventId) {
    const updatedFriends = friends.map(f => f.id === friendId ? { ...f, eventLog: f.eventLog?.filter(e => e.id !== eventId) || [] } : f);
    setFriends(updatedFriends);
  }

  function snoozeReminder(friendId, reminderId, days = 1) {
    const updatedFriends = friends.map(f => {
      if (f.id !== friendId) return f;
      const updatedReminders = f.reminders?.map(r => {
        if (r.id !== reminderId) return r;
        const newDate = parseLocalDate(r.date); newDate.setDate(newDate.getDate() + days);
        return { ...r, date: newDate.toISOString() };
      });
      return { ...f, reminders: updatedReminders };
    });
    setFriends(updatedFriends);
  }

  function deleteReminder(friendId, reminderId) {
    const updatedFriends = friends.map(f => f.id === friendId ? { ...f, reminders: f.reminders?.filter(r => r.id !== reminderId) || [] } : f);
    setFriends(updatedFriends);
  }

  function getInitials(name) { return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2); }

  function handleImageUpload(e, isEditing = false) {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (isEditing) setEditedFriend({ ...editedFriend, profilePicture: reader.result });
        else setNewFriend({ ...newFriend, profilePicture: reader.result });
      };
      reader.readAsDataURL(file);
    }
  }

  function getProfileColor(name) {
    const colors = ['bg-blue-500','bg-green-500','bg-purple-500','bg-pink-500','bg-indigo-500','bg-red-500','bg-yellow-500','bg-teal-500'];
    const index = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[index % colors.length];
  }

  function getFrequencyLabel(days) {
    if (days === 0) return 'None';
    const map = { 7: 'Weekly', 14: 'Bi-weekly', 30: 'Monthly', 60: 'Bi-monthly', 90: 'Quarterly' };
    return map[days] || `${days} days`;
  }

  const filteredFriends = useMemo(() => {
    let filtered = selectedGroup === 'all' ? friends : selectedGroup === 'none' ? friends.filter(f => !f.groups || f.groups.length === 0) : friends.filter(f => f.groups && f.groups.includes(selectedGroup));
    if (friendsSearch.trim()) filtered = filtered.filter(f => f.name.toLowerCase().includes(friendsSearch.toLowerCase()));
    return [...filtered].sort((a, b) => {
      let comparison = 0;
      if (friendsSortBy === 'name') { comparison = a.name.localeCompare(b.name); }
      else if (friendsSortBy === 'nextReminder') {
        const aR = a.reminders?.length > 0 ? new Date(a.reminders.sort((x,y) => new Date(x.date)-new Date(y.date))[0].date) : new Date('9999-12-31');
        const bR = b.reminders?.length > 0 ? new Date(b.reminders.sort((x,y) => new Date(x.date)-new Date(y.date))[0].date) : new Date('9999-12-31');
        comparison = aR - bR;
      } else if (friendsSortBy === 'lastContacted') {
        const aL = a.eventLog?.length > 0 ? new Date([...a.eventLog].filter(e=>e.type!=='system').sort((x,y)=>new Date(y.date)-new Date(x.date))[0]?.date || 0) : new Date(0);
        const bL = b.eventLog?.length > 0 ? new Date([...b.eventLog].filter(e=>e.type!=='system').sort((x,y)=>new Date(y.date)-new Date(x.date))[0]?.date || 0) : new Date(0);
        comparison = bL - aL;
      }
      return friendsSortOrder === 'asc' ? comparison : -comparison;
    });
  }, [friends, selectedGroup, friendsSearch, friendsSortBy, friendsSortOrder]);

  return (
    <div className={`min-h-screen bg-gray-50 dark:bg-gray-900 flex${isDark ? ' dark' : ''}`}>

      {/* Desktop Sidebar */}
      <div className={`hidden md:flex flex-col sticky top-0 h-screen bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-200 z-30 flex-shrink-0 ${sidebarOpen ? 'w-48' : 'w-14'}`}>
        <div className={`p-3 border-b border-gray-100 dark:border-gray-800 flex items-center ${sidebarOpen ? 'justify-between' : 'justify-center'}`}>
          {sidebarOpen && <span className="text-sm font-semibold text-gray-900 dark:text-gray-50">UnGhost</span>}
          <div className="flex items-center gap-1">
            {sidebarOpen && (
              <button onClick={() => setIsDark(!isDark)} className="p-1.5 text-gray-400 dark:text-gray-500 hover:text-gray-900 dark:hover:text-gray-100 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700">
                {isDark ? <Sun size={14} /> : <Moon size={14} />}
              </button>
            )}
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1.5 text-gray-400 dark:text-gray-500 hover:text-gray-900 dark:hover:text-gray-100 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"><Menu size={14} /></button>
          </div>
        </div>
        <div className="p-2 space-y-1">
          {[
            { page: 'dashboard', icon: <Home size={16} />, label: 'Home' },
            { page: 'friends', icon: <UserCircle size={16} />, label: 'People' },
            { page: 'groups', icon: <Network size={16} />, label: 'Groups' },
            { page: 'events', icon: <Calendar size={16} />, label: 'Events' },
          ].map(({ page, icon, label }) => (
            <button key={page} onClick={() => { setCurrentPage(page); setCurrentView('home'); }} className={`w-full py-2 px-2.5 rounded-md text-sm font-medium flex items-center gap-2.5 transition-colors ${currentPage === page ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-50' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'} ${!sidebarOpen ? 'justify-center' : ''}`} title={!sidebarOpen ? label : undefined}>
              {icon}
              {sidebarOpen && <span>{label}</span>}
            </button>
          ))}
        </div>

        {/* Google account — pinned to bottom of sidebar */}
        <div className="mt-auto p-2 border-t border-gray-100 dark:border-gray-800">
          {googleUser ? (
            <div className={`flex items-center gap-2 p-1.5 rounded-md ${!sidebarOpen ? 'justify-center' : ''}`}>
              <img src={googleUser.picture} alt={googleUser.name} className="w-6 h-6 rounded-full flex-shrink-0" referrerPolicy="no-referrer" />
              {sidebarOpen && (
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-900 dark:text-gray-50 truncate">{googleUser.name}</p>
                  <button onClick={handleGoogleSignOut} className="text-xs text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 transition-colors">Sign out</button>
                </div>
              )}
            </div>
          ) : sidebarOpen ? (
            <button onClick={handleGoogleSignIn} className="w-full flex items-center gap-2 px-2.5 py-2 rounded-md border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 text-sm text-gray-700 dark:text-gray-300 transition-colors">
              <GoogleIcon size={16} />
              Sign in with Google
            </button>
          ) : (
            <button onClick={handleGoogleSignIn} title="Sign in with Google" className="w-full flex items-center justify-center p-1.5 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <GoogleIcon size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 min-w-0 pb-16 md:pb-0">

        {/* Mobile Google account bar */}
        <div className="md:hidden flex items-center justify-between px-4 pt-4 pb-1">
          <span className="text-sm font-semibold text-gray-900 dark:text-gray-50">UnGhost</span>
          {googleUser ? (
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 dark:text-gray-400 hidden xs:block">{googleUser.name}</span>
              <button onClick={handleGoogleSignOut} title="Sign out" className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 transition-colors">
                <img src={googleUser.picture} alt={googleUser.name} className="w-7 h-7 rounded-full" referrerPolicy="no-referrer" />
              </button>
            </div>
          ) : (
            <button onClick={handleGoogleSignIn} className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 text-xs text-gray-700 dark:text-gray-300 transition-colors">
              <GoogleIcon size={14} />
              Sign in
            </button>
          )}
        </div>

        <div className="max-w-[960px] mx-auto px-4 md:px-6 py-6">

          {/* Friend Detail View */}
          {currentView === 'detail' && viewingFriend && (
            <div>
              <div className="flex items-center gap-1.5 text-sm mb-6">
                <button onClick={() => { setCurrentView('home'); setCurrentPage('friends'); setViewingFriendId(null); setIsEditingFriend(false); setEditedFriend(null); }} className="text-gray-500 dark:text-gray-400 hover:text-gray-900">People</button>
                <ChevronDown size={14} className="text-gray-400 dark:text-gray-500 -rotate-90" />
                <span className="text-gray-900 dark:text-gray-50 font-medium">{viewingFriend.name}</span>
              </div>
              <div className="space-y-4">
                {/* Top contact card */}
                <div className="bg-white dark:bg-gray-800 border rounded-md p-6">
                  <div className="flex items-center gap-4">
                    {viewingFriend.profilePicture ? <img src={viewingFriend.profilePicture} alt={viewingFriend.name} className="w-16 h-16 rounded-full object-cover flex-shrink-0" /> : <div className={`w-16 h-16 rounded-full ${getProfileColor(viewingFriend.name)} text-white flex items-center justify-center text-xl font-bold flex-shrink-0`}>{getInitials(viewingFriend.name)}</div>}
                    <div className="flex-1 min-w-0">
                      <h2 className="text-2xl font-semibold mb-2 text-gray-900 dark:text-gray-50">{viewingFriend.name}</h2>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                        {viewingFriend.phone ? <a href={`tel:${viewingFriend.phone}`} className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900"><Phone size={14} className="text-gray-400 dark:text-gray-500 flex-shrink-0" />{viewingFriend.phone}</a> : <span className="flex items-center gap-1.5 text-sm text-gray-300 dark:text-gray-600"><Phone size={14} className="flex-shrink-0" />No phone</span>}
                        {viewingFriend.email ? <a href={`mailto:${viewingFriend.email}`} className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900"><Mail size={14} className="text-gray-400 dark:text-gray-500 flex-shrink-0" />{viewingFriend.email}</a> : <span className="flex items-center gap-1.5 text-sm text-gray-300 dark:text-gray-600"><Mail size={14} className="flex-shrink-0" />No email</span>}
                      </div>
                    </div>
                    {(() => {
                      return (
                        <div className="relative flex-shrink-0">
                          <button onClick={(e) => { setGroupActionsRect(e.currentTarget.getBoundingClientRect()); setGroupActionsOpen(groupActionsOpen === viewingFriend.id ? null : viewingFriend.id); }} className="p-2 text-gray-400 dark:text-gray-500 hover:text-gray-900 rounded border border-gray-200 dark:border-gray-700"><MoreVertical size={16} /></button>
                          <SmartDropdown anchorRect={groupActionsRect} open={groupActionsOpen === viewingFriend.id} onClose={() => setGroupActionsOpen(null)}>
                            <button onClick={() => { const parts = viewingFriend.name.split(' '); setEditedFriend({ ...viewingFriend, firstName: parts[0] || '', lastName: parts.slice(1).join(' ') || '', groups: viewingFriend.groups || [] }); setIsEditingFriend(true); setGroupActionsOpen(null); setLikesInput(''); }} className="w-full px-4 py-2.5 text-sm text-left text-gray-900 dark:text-gray-50 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2"><Edit2 size={14} className="text-gray-400 dark:text-gray-500" />Edit</button>
                            <button onClick={() => { setGroupActionsOpen(null); if (confirm('Delete this person?')) { setFriends(friends.filter(f => f.id !== viewingFriend.id)); setCurrentView('home'); setViewingFriendId(null); } }} className="w-full px-4 py-2.5 text-sm text-left hover:bg-red-50 dark:hover:bg-red-950/50 text-red-600 dark:text-red-400 flex items-center gap-2"><Trash2 size={14} />Delete</button>
                          </SmartDropdown>
                        </div>
                      );
                    })()}
                  </div>
                </div>

                {/* Tabs */}
                <div className="bg-white dark:bg-gray-800 border rounded-md overflow-hidden">
                  <div className="flex border-b border-gray-200 dark:border-gray-700">
                    {[['profile', 'Profile'], ['reminders', 'Check-ins'], ['events', 'Events']].map(([tab, label]) => (
                      <button key={tab} onClick={() => setDetailTab(tab)} className={`px-5 py-3 text-sm font-medium border-b-2 transition-colors ${detailTab === tab ? 'border-gray-900 dark:border-gray-300 text-gray-900 dark:text-gray-50' : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700'}`}>
                        {label}
                        {tab === 'reminders' && viewingFriend.reminders?.length > 0 && <span className="ml-1.5 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 px-1.5 py-0.5 rounded-full">{viewingFriend.reminders.length}</span>}
                        {tab === 'events' && (viewingFriend.eventLog||[]).filter(e=>e.type!=='system'&&e.type!=='reminder_completed').length > 0 && <span className="ml-1.5 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 px-1.5 py-0.5 rounded-full">{(viewingFriend.eventLog||[]).filter(e=>e.type!=='system'&&e.type!=='reminder_completed').length}</span>}
                      </button>
                    ))}
                  </div>

                  <div className="p-5">
                    {/* Profile tab */}
                    {detailTab === 'profile' && (
                      <div className="space-y-5">
                        {/* Birthday */}
                        <div>
                          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">Birthday</p>
                          {viewingFriend.birthday ? <p className="text-sm text-gray-900 dark:text-gray-50">{parseLocalDate(viewingFriend.birthday).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p> : <p className="text-sm text-gray-400 dark:text-gray-500">Not set</p>}
                        </div>
                        <div className="border-t border-gray-100 dark:border-gray-800" />
                        {/* Likes */}
                        <div>
                          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">Likes</p>
                          {viewingFriend.likes && viewingFriend.likes.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                              {viewingFriend.likes.map((like, i) => <span key={i} className="text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-3 py-1 rounded-full">{like}</span>)}
                            </div>
                          ) : <p className="text-sm text-gray-400 dark:text-gray-500">Nothing added yet</p>}
                        </div>
                        <div className="border-t border-gray-100 dark:border-gray-800" />
                        {/* Notes */}
                        <div>
                          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">Notes</p>
                          {viewingFriend.notes ? <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{viewingFriend.notes}</p> : <p className="text-sm text-gray-400 dark:text-gray-500">No notes</p>}
                        </div>
                        <div className="border-t border-gray-100 dark:border-gray-800" />
                        {/* Groups */}
                        <div>
                          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">Groups</p>
                          {viewingFriend.groups && viewingFriend.groups.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                              {viewingFriend.groups.map(groupId => { const group = getGroupById(groupId); if (!group) return null; return (
                                <span key={groupId} className="flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium" style={{ backgroundColor: group.color + '20', color: group.color, border: `1px solid ${group.color}50` }}>
                                  <span>{group.icon}</span><span>{group.name}</span>
                                </span>
                              ); })}
                            </div>
                          ) : <p className="text-sm text-gray-400 dark:text-gray-500">Not in any groups</p>}
                        </div>
                      </div>
                    )}

                    {/* Reminders tab */}
                    {detailTab === 'reminders' && (
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Upcoming Check-ins</p>
                          <button onClick={() => { setModalType('reminder'); setShowCheckInModal(true); }} className="px-3 py-1.5 text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md flex items-center gap-1.5"><Plus size={14} />Add Check-in</button>
                        </div>
                        {viewingFriend.reminders && viewingFriend.reminders.length > 0 ? (
                          <div className="space-y-2">
                            {[...viewingFriend.reminders].sort((a, b) => parseLocalDate(a.date) - parseLocalDate(b.date)).map(reminder => {
                              const rDate = parseLocalDate(reminder.date); const today = new Date(); today.setHours(0,0,0,0);
                              const isOverdue = rDate < today; const isToday = rDate.toDateString() === today.toDateString();
                              return (
                                <div key={reminder.id} className={`p-3 rounded-md border ${isOverdue ? 'bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800' : isToday ? 'bg-yellow-50 dark:bg-yellow-950 border-yellow-200 dark:border-yellow-800' : 'bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700'}`}>
                                  <div className="flex items-start justify-between gap-3">
                                    <div className="flex-1">
                                      <p className="text-sm font-medium text-gray-900 dark:text-gray-50">{reminder.title}</p>
                                      <div className="flex items-center gap-2 mt-1">
                                        <p className={`text-xs ${isOverdue ? 'text-red-600 dark:text-red-400' : isToday ? 'text-yellow-700 dark:text-yellow-400' : 'text-gray-500 dark:text-gray-400'}`}>{rDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</p>
                                        {reminder.isRecurring && <span className="text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded">Repeats every {reminder.recurringPeriod} days</span>}
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-1.5 flex-shrink-0">
                                      <button onClick={() => completeReminder(viewingFriend.id, reminder.id)} title="Mark complete" className="p-1.5 text-green-600 dark:text-green-400 bg-white dark:bg-gray-800 hover:bg-green-50 dark:hover:bg-green-900/40 rounded border border-gray-200 dark:border-gray-700"><Check size={15} /></button>
                                      <button onClick={() => snoozeReminder(viewingFriend.id, reminder.id, 1)} title="Snooze 1 day" className="p-1.5 text-gray-400 dark:text-gray-500 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 rounded border border-gray-200 dark:border-gray-700"><Bell size={15} /></button>
                                      <div className="relative">
                                        <button onClick={(e) => { setReminderMenuRect(e.currentTarget.getBoundingClientRect()); setReminderMenuOpen(reminderMenuOpen === reminder.id ? null : reminder.id); }} className="p-1.5 text-gray-400 dark:text-gray-500 bg-white dark:bg-gray-800 hover:text-gray-900 rounded border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700"><MoreVertical size={15} /></button>
                                        <SmartDropdown anchorRect={reminderMenuRect} open={reminderMenuOpen === reminder.id} onClose={() => setReminderMenuOpen(null)}>
                                          <button onClick={() => { setEditingReminder(reminder); setModalType('reminder'); setCheckInTitle(reminder.title); setCheckInDate(toLocalDateStr(parseLocalDate(reminder.date))); setIsRecurring(reminder.isRecurring || false); setRecurringPeriod(reminder.recurringPeriod || 7); setShowCheckInModal(true); setReminderMenuOpen(null); }} className="w-full px-4 py-2.5 text-sm text-left text-gray-900 dark:text-gray-50 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2"><Edit2 size={14} className="text-gray-400 dark:text-gray-500" />Edit</button>
                                          <button onClick={() => { deleteReminder(viewingFriend.id, reminder.id); setReminderMenuOpen(null); }} className="w-full px-4 py-2.5 text-sm text-left hover:bg-red-50 dark:hover:bg-red-950/50 text-red-600 dark:text-red-400 flex items-center gap-2 border-t border-gray-100 dark:border-gray-800"><Trash2 size={14} />Delete</button>
                                        </SmartDropdown>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <div className="text-center py-8"><div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-2"><Bell size={20} className="text-gray-400 dark:text-gray-500" /></div><p className="text-sm font-medium text-gray-900 dark:text-gray-50 mb-0.5">No check-ins</p><p className="text-xs text-gray-500 dark:text-gray-400">Add a check-in to stay in touch</p></div>
                        )}
                      </div>
                    )}

                    {/* Events tab */}
                    {detailTab === 'events' && (
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Event Log</p>
                          <button onClick={() => { setModalType('event'); setCheckInTitle(''); setCheckInNote(''); setCheckInDate(toLocalDateStr()); setShowCheckInModal(true); }} className="px-3 py-1.5 text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md flex items-center gap-1.5"><Plus size={14} />Log Event</button>
                        </div>
                        {viewingFriend.eventLog && viewingFriend.eventLog.filter(e => e.type !== 'system' && e.type !== 'reminder_completed').length > 0 ? (
                          <div className="space-y-2">
                            {[...viewingFriend.eventLog].filter(e => e.type !== 'system' && e.type !== 'reminder_completed').sort((a, b) => new Date(b.date) - new Date(a.date)).map((event) => {
                              const eventDate = parseLocalDate(event.date);
                              return (
                                <div key={event.id} className="group bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-md p-3 flex items-start justify-between gap-3 hover:border-gray-300 transition-colors">
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900 dark:text-gray-50">{event.title || 'Event'}</p>
                                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{(() => { const rel = getRelativeDateLabel(eventDate); const fmt = eventDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }); return rel ? `${rel} · ${fmt}` : fmt; })()}</p>
                                    {event.taggedFriendIds && event.taggedFriendIds.length > 1 && <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">with {event.taggedFriendIds.filter(id => id !== viewingFriend.id).map(id => friends.find(f => f.id === id)?.name).filter(Boolean).join(', ')}</p>}
                                    {event.note && <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{event.note}</p>}
                                    {event.type === 'reminder_completed' && <span className="inline-block text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded mt-1">From check-in</span>}
                                  </div>
                                  <div className="relative flex-shrink-0">
                                    <button onClick={(e) => { setEventMenuRect(e.currentTarget.getBoundingClientRect()); setEventMenuOpen(eventMenuOpen === event.id ? null : event.id); }} className="p-1.5 text-gray-400 dark:text-gray-500 hover:text-gray-900 rounded border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 opacity-0 group-hover:opacity-100 transition-opacity"><MoreVertical size={15} /></button>
                                    <SmartDropdown anchorRect={eventMenuRect} open={eventMenuOpen === event.id} onClose={() => setEventMenuOpen(null)}>
                                      <button onClick={() => { setEditingCheckIn({ id: event.id, title: event.title || 'Event', note: event.note || '', date: toLocalDateStr(parseLocalDate(event.date)), taggedFriendIds: event.taggedFriendIds || [viewingFriend.id] }); setShowEditCheckInModal(true); setEventMenuOpen(null); }} className="w-full px-4 py-2.5 text-sm text-left text-gray-900 dark:text-gray-50 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2"><Edit2 size={14} className="text-gray-400 dark:text-gray-500" />Edit</button>
                                      <button onClick={() => { if (confirm('Delete this event?')) { deleteEvent(viewingFriend.id, event.id); setEventMenuOpen(null); } }} className="w-full px-4 py-2.5 text-sm text-left hover:bg-red-50 dark:hover:bg-red-950/50 text-red-600 dark:text-red-400 flex items-center gap-2 border-t border-gray-100 dark:border-gray-800"><Trash2 size={14} />Delete</button>
                                    </SmartDropdown>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <div className="text-center py-8"><div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-3"><Calendar size={24} className="text-gray-400 dark:text-gray-500" /></div><p className="text-sm font-medium text-gray-900 dark:text-gray-50 mb-1">No events logged</p><p className="text-xs text-gray-500 dark:text-gray-400">Start logging your touchpoints with this friend</p></div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Dashboard */}
          {currentView === 'home' && currentPage === 'dashboard' && (
            <div>
              {friends.length === 0 ? (
                <div className="bg-white dark:bg-gray-800 border rounded-md p-12 text-center">
                  <h2 className="text-xl font-semibold mb-2">Welcome to UnGhost!</h2>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">Track your relationships</p>
                  <button onClick={() => setShowAddFriendModal(true)} className="px-6 py-3 bg-gray-900 dark:bg-gray-700 text-white rounded-md hover:bg-gray-800 dark:hover:bg-gray-600 inline-flex items-center gap-2 text-sm"><UserPlus size={20} />Add Your First Person</button>
                </div>
              ) : (() => {
                const today = new Date(); today.setHours(0,0,0,0);

                // Overdue — reminders whose date has passed
                const overdue = friends.flatMap(f => (f.reminders||[]).map(r => ({...r, friend: f}))).filter(r => {
                  const d = parseLocalDate(r.date); d.setHours(0,0,0,0);
                  return d < today;
                }).sort((a,b) => parseLocalDate(a.date) - parseLocalDate(b.date));

                // Due soon — reminders in next 7 days
                const dueSoon = friends.flatMap(f => (f.reminders||[]).map(r => ({...r, friend: f}))).filter(r => {
                  const d = parseLocalDate(r.date); d.setHours(0,0,0,0);
                  return d >= today && d <= new Date(today.getTime() + 7*24*60*60*1000);
                }).sort((a,b) => parseLocalDate(a.date) - parseLocalDate(b.date));

                // Due in next 7 days
                const dueThisWeek = friends.flatMap(f => (f.reminders||[]).map(r => ({...r, friend: f}))).filter(r => {
                  const d = parseLocalDate(r.date); d.setHours(0,0,0,0);
                  return d >= today && d <= new Date(today.getTime() + 7*24*60*60*1000);
                }).sort((a,b) => parseLocalDate(a.date) - parseLocalDate(b.date));

                // Due in next month (8-30 days out)
                const dueThisMonth = friends.flatMap(f => (f.reminders||[]).map(r => ({...r, friend: f}))).filter(r => {
                  const d = parseLocalDate(r.date); d.setHours(0,0,0,0);
                  return d > new Date(today.getTime() + 7*24*60*60*1000) && d <= new Date(today.getTime() + 30*24*60*60*1000);
                }).sort((a,b) => parseLocalDate(a.date) - parseLocalDate(b.date));

                // Upcoming birthdays in next 30 days
                const upcomingBirthdays = friends.filter(f => f.birthday).map(f => {
                  const bday = parseLocalDate(f.birthday);
                  const thisYear = new Date(today.getFullYear(), bday.getMonth(), bday.getDate());
                  if (thisYear < today) thisYear.setFullYear(today.getFullYear() + 1);
                  const daysUntil = Math.round((thisYear - today) / (1000*60*60*24));
                  return { ...f, nextBirthday: thisYear, daysUntil };
                }).filter(f => f.daysUntil <= 30).sort((a,b) => a.daysUntil - b.daysUntil);

                const ReminderRow = ({ reminder, badge, badgeColor }) => (
                  <div className="flex items-center justify-between py-3 px-2 -mx-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md cursor-pointer transition-colors" onClick={() => { setViewingFriendId(reminder.friend.id); setCurrentView('detail'); setCurrentPage('friends'); setDetailTab('reminders'); }}>
                    <div className="flex items-center gap-3">
                      {reminder.friend.profilePicture ? <img src={reminder.friend.profilePicture} alt={reminder.friend.name} className="w-9 h-9 rounded-full object-cover flex-shrink-0" /> : <div className={`w-9 h-9 rounded-full ${getProfileColor(reminder.friend.name)} text-white flex items-center justify-center text-sm font-medium flex-shrink-0`}>{getInitials(reminder.friend.name)}</div>}
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-50">{reminder.title}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{reminder.friend.name}</p>
                      </div>
                    </div>
                    {badge && <span className={`text-xs font-medium px-2 py-1 rounded-full ${badgeColor}`}>{badge}</span>}
                  </div>
                );

                const ReminderSection = ({ label, labelColor, reminders, renderBadge }) => (
                  reminders.length === 0 ? null : (
                    <div className="py-4 first:pt-0 last:pb-0">
                      <p className={`text-xs font-medium uppercase tracking-wide mb-3 ${labelColor}`}>{label}</p>
                      <div className="divide-y dark:divide-gray-700">
                        {reminders.map(r => {
                          const { badge, badgeColor } = renderBadge(r);
                          return <ReminderRow key={r.id} reminder={r} badge={badge} badgeColor={badgeColor} />;
                        })}
                      </div>
                    </div>
                  )
                );

                return (
                  <div className="flex flex-col gap-4">
                    {/* This Week — combined reminders + birthdays */}
                    <div className="bg-white dark:bg-gray-800 border rounded-md overflow-hidden">
                      <div className="px-4 pt-4 pb-3 border-b border-gray-100 dark:border-gray-800">
                        <h3 className="text-sm font-medium text-gray-900 dark:text-gray-50">This Week</h3>
                      </div>
                      <div className="p-4">
                        {(() => {
                          const weekEnd = new Date(today.getTime() + 7*24*60*60*1000);

                          const reminderItems = friends.flatMap(f => (f.reminders||[]).map(r => {
                            const d = parseLocalDate(r.date); d.setHours(0,0,0,0);
                            return { type: 'reminder', sortDate: d, title: r.title, friend: f, id: r.id };
                          })).filter(item => item.sortDate <= weekEnd)
                            .sort((a,b) => a.sortDate - b.sortDate);

                          const birthdayItems = upcomingBirthdays.filter(f => f.daysUntil <= 7).map(f => ({
                            type: 'birthday',
                            sortDate: f.nextBirthday,
                            title: 'Birthday',
                            friend: f,
                            id: `bday-${f.id}`
                          }));

                          const seenEventIds = new Set();
                          const eventItems = friends.flatMap(f => (f.eventLog||[])
                            .filter(e => e.type !== 'system' && e.type !== 'reminder_completed')
                            .map(e => ({ ...e, friend: f }))
                          ).filter(e => {
                            if (seenEventIds.has(e.id)) return false;
                            seenEventIds.add(e.id);
                            const d = parseLocalDate(e.date); d.setHours(0,0,0,0);
                            return d >= today && d <= weekEnd;
                          }).map(e => {
                            const d = parseLocalDate(e.date); d.setHours(0,0,0,0);
                            return { type: 'event', sortDate: d, title: e.title || 'Event', friend: e.friend, id: e.id };
                          });

                          const allItems = [...reminderItems, ...birthdayItems, ...eventItems].sort((a,b) => a.sortDate - b.sortDate);

                          if (allItems.length === 0) return <p className="text-sm text-gray-400 dark:text-gray-500 py-2">Nothing due this week! 🎉</p>;

                          const overdueItems = allItems.filter(item => item.sortDate < today && item.type === 'reminder');
                          const todayItems = allItems.filter(item => item.sortDate.toDateString() === today.toDateString());
                          const upcomingItems = allItems.filter(item => item.sortDate > today && item.sortDate.toDateString() !== today.toDateString());

                          const ItemRow = ({ item }) => (
                            <div
                              className="flex items-center justify-between py-3 px-2 -mx-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md cursor-pointer transition-colors"
                              onClick={() => { setViewingFriendId(item.friend.id); setCurrentView('detail'); setCurrentPage('friends'); setDetailTab(item.type === 'reminder' ? 'reminders' : item.type === 'event' ? 'events' : 'profile'); }}
                            >
                              <div className="flex items-center gap-3">
                                <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${item.type === 'reminder' ? 'bg-green-50 dark:bg-green-900/30' : 'bg-blue-50 dark:bg-blue-900/30'}`}>
                                  {item.type === 'reminder'
                                    ? <CheckCircle size={17} className="text-green-500 dark:text-green-400" />
                                    : <Calendar size={17} className="text-blue-500 dark:text-blue-400" />
                                  }
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-gray-900 dark:text-gray-50">{item.title}</p>
                                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{item.friend.name}</p>
                                </div>
                              </div>
                              <div>
                                {item.type === 'reminder' && item.sortDate < today && (
                                  <span className="text-xs font-medium px-2 py-1 rounded-full bg-red-50 text-red-500">{Math.round((today - item.sortDate)/(1000*60*60*24))}d overdue</span>
                                )}
                                {item.sortDate.toDateString() === today.toDateString() && (
                                  <span className="text-xs font-medium px-2 py-1 rounded-full bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300">Today</span>
                                )}
                                {item.sortDate > today && item.sortDate.toDateString() !== today.toDateString() && (
                                  <span className="text-xs font-medium px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400">{item.sortDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
                                )}
                              </div>
                            </div>
                          );

                          const Section = ({ label, labelColor, items }) => items.length === 0 ? null : (
                            <div className="py-4 first:pt-0 last:pb-0">
                              <p className={`text-xs font-medium uppercase tracking-wide mb-3 ${labelColor}`}>{label}</p>
                              <div className="divide-y dark:divide-gray-700">
                                {items.map(item => <ItemRow key={item.id} item={item} />)}
                              </div>
                            </div>
                          );

                          return (
                            <div className="divide-y dark:divide-gray-700">
                              <Section label="Overdue" labelColor="text-red-500" items={overdueItems} />
                              <Section label="Today" labelColor="text-green-600 dark:text-green-400" items={todayItems} />
                              <Section label="Coming up" labelColor="text-gray-400 dark:text-gray-500" items={upcomingItems} />
                            </div>
                          );
                        })()}
                      </div>
                    </div>

                    {/* Recent Events */}
                    {(() => {
                      const seenIds = new Set();
                      const recentEvents = friends.flatMap(f => (f.eventLog||[]).filter(e=>e.type!=='system'&&e.type!=='reminder_completed').map(e=>({...e, friend: f}))).filter(e => { if (seenIds.has(e.id)) return false; seenIds.add(e.id); return true; }).sort((a,b) => new Date(b.date)-new Date(a.date)).slice(0, 5);
                      return (
                        <div className="bg-white dark:bg-gray-800 border rounded-md p-4">
                          <div className="flex items-center justify-between mb-3">
                            <h3 className="text-sm font-medium text-gray-900 dark:text-gray-50">Recent Events</h3>
                            <button onClick={() => { setCurrentPage('events'); setCurrentView('home'); }} className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-900">View all →</button>
                          </div>
                          {recentEvents.length === 0 ? (
                            <p className="text-sm text-gray-400 dark:text-gray-500 py-2">No events logged yet</p>
                          ) : (
                            <div className="space-y-2">
                              {recentEvents.map(event => {
                                const d = parseLocalDate(event.date);
                                return (
                                  <div key={event.id} className="bg-white dark:bg-gray-800 border rounded-md p-4 hover:border-gray-300 transition-colors cursor-pointer" onClick={() => { setViewingFriendId(event.friend.id); setCurrentView('detail'); setCurrentPage('friends'); setDetailTab('events'); }}>
                                    <div className="flex items-start justify-between gap-3">
                                      <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-900 dark:text-gray-50">{event.title || 'Event'}</p>
                                        <div className="flex items-center gap-1.5 flex-wrap mt-1">
                                          <button onClick={e => { e.stopPropagation(); setViewingFriendId(event.friend.id); setCurrentView('detail'); setDetailTab('profile'); }} className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">{event.friend.name}</button>
                                        </div>
                                        {event.note && <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">{event.note}</p>}
                                      </div>
                                      <p className="text-xs text-gray-400 dark:text-gray-500 flex-shrink-0">{getRelativeDateLabel(d) || d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })()}
                  </div>
                );
              })()}
            </div>
          )}

          {/* Friends List */}
          {currentView === 'home' && currentPage === 'friends' && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-50">People</h2>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <div className="relative" ref={importExportRef}>
                      <button onClick={(e) => { setImportExportRect(e.currentTarget.getBoundingClientRect()); setShowImportExportDropdown(!showImportExportDropdown); }} className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2 text-sm"><Download size={16} />Data<ChevronDown size={14} className="text-gray-400 dark:text-gray-500" /></button>
                      <SmartDropdown anchorRect={importExportRect} open={showImportExportDropdown} onClose={() => setShowImportExportDropdown(false)}>
                        <label className="w-full px-4 py-2.5 text-sm text-left text-gray-900 dark:text-gray-50 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2 cursor-pointer"><Upload size={16} className="text-gray-400 dark:text-gray-500" />Import<input type="file" accept=".json" onChange={(e) => { importFriends(e); setShowImportExportDropdown(false); }} className="hidden" /></label>
                        <button onClick={() => { exportFriends(); setShowImportExportDropdown(false); }} className="w-full px-4 py-2.5 text-sm text-left text-gray-900 dark:text-gray-50 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2"><Download size={16} className="text-gray-400 dark:text-gray-500" />Export</button>
                      </SmartDropdown>
                    </div>
                  </div>
                  <button onClick={() => setShowAddFriendModal(true)} className="px-4 py-2 bg-gray-900 dark:bg-gray-700 text-white rounded-md hover:bg-gray-800 dark:hover:bg-gray-600 text-sm flex items-center gap-2 text-sm"><Plus size={16} />Add Friend</button>
                </div>
              </div>

              {friends.length > 0 && (
                <div className="mb-4 flex items-center gap-2">
                  <div className="relative inline-block" ref={groupFilterRef}>
                    <button onClick={(e) => { setGroupFilterRect(e.currentTarget.getBoundingClientRect()); setShowGroupFilterDropdown(!showGroupFilterDropdown); }} className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2">
                      <span>
                        {selectedGroup === 'all' && `All (${friends.length})`}
                        {selectedGroup === 'none' && `None (${friends.filter(f => !f.groups || f.groups.length === 0).length})`}
                        {selectedGroup !== 'all' && selectedGroup !== 'none' && (() => { const group = getGroupById(selectedGroup); return group ? <span className="flex items-center gap-1.5"><span style={{ color: group.color }}>{group.icon}</span><span>{group.name}</span><span className="text-gray-500 dark:text-gray-400">({friends.filter(f => f.groups && f.groups.includes(selectedGroup)).length})</span></span> : null; })()}
                      </span>
                      <ChevronDown size={16} className="text-gray-400 dark:text-gray-500" />
                    </button>
                    <SmartDropdown anchorRect={groupFilterRect} open={showGroupFilterDropdown} onClose={() => setShowGroupFilterDropdown(false)}>
                      <div className="max-h-80 overflow-y-auto w-64">
                        <button onClick={() => { setSelectedGroup('all'); setShowGroupFilterDropdown(false); }} className={`w-full px-4 py-2.5 text-sm text-left text-gray-900 dark:text-gray-50 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center justify-between ${selectedGroup==='all'?'bg-gray-50 dark:bg-gray-900':''}`}><span>All</span><span className="text-gray-500 dark:text-gray-400">({friends.length})</span></button>
                        <button onClick={() => { setSelectedGroup('none'); setShowGroupFilterDropdown(false); }} className={`w-full px-4 py-2.5 text-sm text-left text-gray-900 dark:text-gray-50 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center justify-between ${selectedGroup==='none'?'bg-gray-50 dark:bg-gray-900':''}`}><span>None</span><span className="text-gray-500 dark:text-gray-400">({friends.filter(f=>!f.groups||f.groups.length===0).length})</span></button>
                        {groups.length > 0 && <div className="border-t border-gray-100 dark:border-gray-800 mt-1 pt-1">{[...groups].sort((a,b)=>a.name.localeCompare(b.name)).map(group => <button key={group.id} onClick={() => { setSelectedGroup(group.id); setShowGroupFilterDropdown(false); }} className={`w-full px-4 py-2.5 text-sm text-left text-gray-900 dark:text-gray-50 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center justify-between ${selectedGroup===group.id?'bg-gray-50 dark:bg-gray-900':''}`}><span className="flex items-center gap-2"><span style={{ color: group.color }}>{group.icon}</span><span>{group.name}</span></span><span className="text-gray-500 dark:text-gray-400">({friends.filter(f=>f.groups&&f.groups.includes(group.id)).length})</span></button>)}</div>}
                      </div>
                    </SmartDropdown>
                  </div>
                  <div className="relative flex-1 max-w-xs">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 pointer-events-none" />
                    <input
                      type="text"
                      placeholder="Search people..."
                      value={friendsSearch}
                      onChange={e => setFriendsSearch(e.target.value)}
                      className="w-full pl-8 pr-3 py-2 text-sm text-gray-900 dark:text-gray-50 placeholder-gray-400 dark:placeholder-gray-500 border border-gray-200 dark:border-gray-700 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900 bg-white dark:bg-gray-800"
                    />
                    {friendsSearch && <button onClick={() => setFriendsSearch('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-700"><X size={13} /></button>}
                  </div>
                </div>
              )}

              {filteredFriends.length === 0 ? (
                <div className="bg-white dark:bg-gray-800 border rounded-md p-12 text-center"><p className="text-gray-600 dark:text-gray-400 mb-4">No people yet</p><button onClick={() => setShowAddFriendModal(true)} className="px-6 py-2 bg-gray-900 dark:bg-gray-700 text-white rounded-md hover:bg-gray-800 dark:hover:bg-gray-600 text-sm">Add Person</button></div>
              ) : (
                <div className="bg-white dark:bg-gray-800 border rounded-md overflow-visible">
                  <div className="border-b bg-gray-50 dark:bg-gray-900">
                    <div className="flex items-center text-xs font-medium text-gray-600 dark:text-gray-400 px-4 py-3">
                      <div className="w-1/4 min-w-0 pr-6">
                        <button onClick={() => { if (friendsSortBy==='name') setFriendsSortOrder(friendsSortOrder==='asc'?'desc':'asc'); else { setFriendsSortBy('name'); setFriendsSortOrder('asc'); } }} className="flex items-center gap-1 -mx-2 px-2 py-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600 hover:text-gray-900 transition-colors">Name{friendsSortBy==='name'&&(friendsSortOrder==='asc'?<ArrowUp size={12}/>:<ArrowDown size={12}/>)}</button>
                      </div>
                      <div className="w-1/4 pr-6">Groups</div>
                      <div className="w-1/4 pr-6">
                        <button onClick={() => { if (friendsSortBy==='lastContacted') setFriendsSortOrder(friendsSortOrder==='asc'?'desc':'asc'); else { setFriendsSortBy('lastContacted'); setFriendsSortOrder('desc'); } }} className="flex items-center gap-1 -mx-2 px-2 py-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600 hover:text-gray-900 transition-colors">Last Checked In{friendsSortBy==='lastContacted'&&(friendsSortOrder==='asc'?<ArrowUp size={12}/>:<ArrowDown size={12}/>)}</button>
                      </div>
                      <div className="w-1/4">
                        <button onClick={() => { if (friendsSortBy==='nextReminder') setFriendsSortOrder(friendsSortOrder==='asc'?'desc':'asc'); else { setFriendsSortBy('nextReminder'); setFriendsSortOrder('asc'); } }} className="flex items-center gap-1 -mx-2 px-2 py-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600 hover:text-gray-900 transition-colors">Next Check-in{friendsSortBy==='nextReminder'&&(friendsSortOrder==='asc'?<ArrowUp size={12}/>:<ArrowDown size={12}/>)}</button>
                      </div>
                    </div>
                  </div>
                  <div className="divide-y dark:divide-gray-700">
                    {filteredFriends.map(friend => {
                      const nextReminder = friend.reminders?.length > 0 ? friend.reminders.sort((a,b)=>new Date(a.date)-new Date(b.date))[0] : null;
                      const lastEvent = friend.eventLog?.length > 0 ? [...friend.eventLog].filter(e=>e.type!=='system').sort((a,b)=>new Date(b.date)-new Date(a.date))[0] : null;
                      return (
                        <div key={friend.id} className="px-4 py-3 transition-colors">
                          <div className="flex items-center">
                            <button onClick={() => { setViewingFriendId(friend.id); setCurrentView('detail'); setDetailTab('profile'); }} onMouseEnter={() => setHoveredFriendId(friend.id)} onMouseLeave={() => setHoveredFriendId(null)} className="w-1/4 min-w-0 flex items-center gap-3 pr-6 text-left transition-opacity">
                              {friend.profilePicture ? <img src={friend.profilePicture} alt={friend.name} className="w-8 h-8 rounded-full object-cover flex-shrink-0" style={{ opacity: hoveredFriendId === friend.id ? 0.5 : 1, transition: 'opacity 0.15s' }} /> : <div className={`w-8 h-8 rounded-full ${getProfileColor(friend.name)} text-white flex items-center justify-center text-xs font-medium flex-shrink-0`} style={{ opacity: hoveredFriendId === friend.id ? 0.5 : 1, transition: 'opacity 0.15s' }}>{getInitials(friend.name)}</div>}
                              <span className="font-medium text-sm text-gray-900 dark:text-gray-50 truncate" style={{ opacity: hoveredFriendId === friend.id ? 0.5 : 1, transition: 'opacity 0.15s' }}>{friend.name}</span>
                            </button>
                            <div className="w-1/4 pr-6">
                              <div className="relative">
                                <button onClick={(e) => { e.stopPropagation(); setQuickAddGroupFriendId(quickAddGroupFriendId===friend.id?null:friend.id); }} className="w-full text-left hover:bg-gray-50 dark:hover:bg-gray-700 rounded px-2 py-1 -mx-2 -my-1">
                                  {friend.groups && friend.groups.length > 0 ? <div className="flex flex-wrap gap-1">{friend.groups.slice(0,2).map(groupId => { const group=getGroupById(groupId); if (!group) return null; return <span key={groupId} className="text-xs px-2 py-0.5 rounded flex items-center gap-1" style={{ backgroundColor: group.color+'20', color: group.color }}><span className="text-[10px]">{group.icon}</span><span>{group.name}</span></span>; })}{friend.groups.length>2&&<span className="text-xs text-gray-500 dark:text-gray-400">+{friend.groups.length-2}</span>}</div> : <span className="text-xs text-gray-400 dark:text-gray-500">—</span>}
                                </button>
                                {quickAddGroupFriendId===friend.id && (<><div className="fixed inset-0 z-10" onClick={(e) => { e.stopPropagation(); setQuickAddGroupFriendId(null); }} /><div className="absolute left-0 top-8 z-20 w-56 bg-white dark:bg-gray-800 border rounded-md shadow-lg max-h-64 overflow-y-auto" onClick={(e)=>e.stopPropagation()}><div className="px-3 py-2 border-b bg-gray-50 dark:bg-gray-900"><p className="text-xs font-medium text-gray-600 dark:text-gray-400">Add to groups</p></div>{groups.length===0?<div className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400">No groups yet</div>:[...groups].sort((a,b)=>a.name.localeCompare(b.name)).map(group => { const isChecked=friend.groups?.includes(group.id)||false; return <div key={group.id} className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-700"><input type="checkbox" id={`quick-group-${friend.id}-${group.id}`} checked={isChecked} onChange={(e)=>{e.stopPropagation();quickToggleGroup(friend.id,group.id);}} className="rounded cursor-pointer" /><label htmlFor={`quick-group-${friend.id}-${group.id}`} className="text-sm flex items-center gap-2 cursor-pointer flex-1"><span style={{color:group.color}}>{group.icon}</span><span>{group.name}</span></label></div>; })}</div></>)}
                              </div>
                            </div>
                            <div className="w-1/4 pr-6">{lastEvent ? <span className="text-sm text-gray-600 dark:text-gray-400">{parseLocalDate(lastEvent.date).toLocaleDateString('en-US',{month:'short',day:'numeric'})}</span> : <span className="text-xs text-gray-400 dark:text-gray-500">—</span>}</div>
                            <div className="w-1/4">{nextReminder ? <span className="text-sm text-gray-600 dark:text-gray-400">{parseLocalDate(nextReminder.date).toLocaleDateString('en-US',{month:'short',day:'numeric'})}</span> : <span className="text-xs text-gray-400 dark:text-gray-500">—</span>}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Groups Page */}
          {currentView === 'home' && currentPage === 'groups' && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-50">Groups</h2>
                <div className="flex items-center gap-3">

                  <button onClick={() => setShowGroupModal(true)} className="px-4 py-2 bg-gray-900 dark:bg-gray-700 text-white rounded-md hover:bg-gray-800 dark:hover:bg-gray-600 text-sm flex items-center gap-2 text-sm"><Plus size={16} />Add Group</button>
                </div>
              </div>

              {groups.length === 0 ? (
                <div className="bg-white dark:bg-gray-800 border rounded-md p-12 text-center">
                  <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4"><Network size={32} className="text-gray-400 dark:text-gray-500" /></div>
                  <h3 className="text-lg font-semibold mb-2">No groups yet</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">Create groups like "Family", "Work", or "College People" to organize your contacts.</p>
                  <button onClick={() => setShowGroupModal(true)} className="px-6 py-2.5 bg-gray-900 dark:bg-gray-700 text-white rounded-md hover:bg-gray-800 dark:hover:bg-gray-600 inline-flex items-center gap-2 text-sm"><Plus size={18} />Create Your First Group</button>
                </div>
              ) : (
                <div className="bg-white dark:bg-gray-800 border rounded-md overflow-x-auto">
                  <div className="min-w-[600px]">
                  <div className="px-4 py-3 bg-gray-50 dark:bg-gray-900 border-b">
                    <div className="flex items-center text-xs font-medium text-gray-600 dark:text-gray-400">
                      <button onClick={() => { if (groupsSortBy==='name') setGroupsSortOrder(groupsSortOrder==='asc'?'desc':'asc'); else { setGroupsSortBy('name'); setGroupsSortOrder('asc'); } }} className="w-48 pr-6 flex items-center gap-1 hover:text-gray-900">Group{groupsSortBy==='name'&&(groupsSortOrder==='asc'?<ArrowUp size={12}/>:<ArrowDown size={12}/>)}</button>
                      <div className="flex-1 min-w-0 pr-6">Description</div>
                      <button onClick={() => { if (groupsSortBy==='members') setGroupsSortOrder(groupsSortOrder==='asc'?'desc':'asc'); else { setGroupsSortBy('members'); setGroupsSortOrder('desc'); } }} className="w-48 pr-6 flex items-center gap-1 hover:text-gray-900">Members{groupsSortBy==='members'&&(groupsSortOrder==='asc'?<ArrowUp size={12}/>:<ArrowDown size={12}/>)}</button>
                      <button onClick={() => { if (groupsSortBy==='created') setGroupsSortOrder(groupsSortOrder==='asc'?'desc':'asc'); else { setGroupsSortBy('created'); setGroupsSortOrder('desc'); } }} className="w-32 flex items-center gap-1 hover:text-gray-900">Created{groupsSortBy==='created'&&(groupsSortOrder==='asc'?<ArrowUp size={12}/>:<ArrowDown size={12}/>)}</button>
                      <div className="w-10"></div>
                    </div>
                  </div>
                  <div className="divide-y dark:divide-gray-700">
                    {[...groups].sort((a, b) => {
                      let cmp = 0;
                      if (groupsSortBy === 'name') cmp = a.name.localeCompare(b.name);
                      else if (groupsSortBy === 'members') cmp = friends.filter(f=>f.groups?.includes(a.id)).length - friends.filter(f=>f.groups?.includes(b.id)).length;
                      else if (groupsSortBy === 'created') cmp = new Date(a.createdAt) - new Date(b.createdAt);
                      return groupsSortOrder === 'asc' ? cmp : -cmp;
                    }).map(group => {
                      const groupFriends = friends.filter(f => f.groups?.includes(group.id));
                      return (
                        <div key={group.id} className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                          <div className="flex items-center">
                            <div className="w-48 pr-6 flex items-center gap-3 flex-shrink-0">
                              <div className="w-8 h-8 rounded-md flex items-center justify-center text-lg flex-shrink-0" style={{ backgroundColor: group.color+'20' }}>{group.icon}</div>
                              <span className="text-sm font-medium truncate" style={{ color: group.color }}>{group.name}</span>
                            </div>
                            <div className="flex-1 min-w-0 pr-6">
                              {group.description ? <span className="text-xs text-gray-500 dark:text-gray-400 truncate block max-w-full">{group.description}</span> : <span className="text-xs text-gray-300 dark:text-gray-600">—</span>}
                            </div>
                            <div className="w-48 pr-6 flex items-center gap-1 flex-shrink-0">
                              {groupFriends.length === 0 ? <span className="text-xs text-gray-400 dark:text-gray-500">—</span> : (
                                <>
                                  <div className="flex -space-x-1 mr-2">
                                    {groupFriends.slice(0, 5).map(friend => (
                                      <div key={friend.id} title={friend.name} className={`w-6 h-6 rounded-full border-2 border-white ${getProfileColor(friend.name)} text-white flex items-center justify-center text-[10px] font-medium`}>
                                        {friend.profilePicture ? <img src={friend.profilePicture} alt={friend.name} className="w-full h-full rounded-full object-cover" /> : getInitials(friend.name)}
                                      </div>
                                    ))}
                                  </div>
                                  <span className="text-xs text-gray-500 dark:text-gray-400">{groupFriends.length} friend{groupFriends.length!==1?'s':''}</span>
                                </>
                              )}
                            </div>
                            <div className="w-32">
                              <span className="text-sm text-gray-500 dark:text-gray-400">{group.createdAt ? new Date(group.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}</span>
                            </div>
                            <div className="w-10 flex items-center justify-end">
                              <button onClick={(e) => { setGroupActionsRect(e.currentTarget.getBoundingClientRect()); setGroupActionsOpen(groupActionsOpen === group.id ? null : group.id); }} className="p-1.5 text-gray-400 dark:text-gray-500 hover:text-gray-900 rounded border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700"><MoreVertical size={16} /></button>
                              <SmartDropdown anchorRect={groupActionsRect} open={groupActionsOpen === group.id} onClose={() => setGroupActionsOpen(null)}>
                                <button onClick={() => { setEditingGroup(group); setShowEditGroupModal(true); setGroupActionsOpen(null); setGroupMemberSearch(''); }} className="w-full px-4 py-2.5 text-sm text-left text-gray-900 dark:text-gray-50 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2"><Edit2 size={14} className="text-gray-400 dark:text-gray-500" />Edit</button>
                                <button onClick={() => { setGroupActionsOpen(null); if (confirm(`Delete group "${group.name}"? People will remain but lose this group tag.`)) { setGroups(groups.filter(g=>g.id!==group.id)); setFriends(friends.map(f=>({...f,groups:f.groups?.filter(gId=>gId!==group.id)||[]}))); } }} className="w-full px-4 py-2.5 text-sm text-left hover:bg-red-50 dark:hover:bg-red-950/50 text-red-600 dark:text-red-400 flex items-center gap-2"><Trash2 size={14} />Delete</button>
                              </SmartDropdown>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Events Page */}
          {currentView === 'home' && currentPage === 'events' && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-50">Events</h2>
                <button onClick={() => { setShowGlobalLogModal(true); setGlobalLogTitle(''); setGlobalLogNote(''); setGlobalLogDate(toLocalDateStr()); setGlobalLogFriends([]); setGlobalLogSearch(''); }} className="px-4 py-2 bg-gray-900 dark:bg-gray-700 text-white rounded-md hover:bg-gray-800 dark:hover:bg-gray-600 flex items-center gap-2 text-sm"><Plus size={16} />Log Event</button>
              </div>
              <div className="flex gap-2 mb-4">
                {/* Friend filter */}
                <div className="relative">
                  <button onClick={(e) => { setEventsFriendFilterRect(e.currentTarget.getBoundingClientRect()); setShowEventsFriendFilter(!showEventsFriendFilter); setShowEventsDateFilter(false); }} className={`px-3 py-1.5 border rounded-md text-sm flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-700 ${eventsFriendFilter !== 'all' ? 'border-gray-900 bg-gray-900 dark:bg-gray-700 text-white hover:bg-gray-800 dark:hover:bg-gray-600' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'}`}>
                    <UserCircle size={14} />
                    {eventsFriendFilter === 'all' ? 'All People' : friends.find(f => f.id === eventsFriendFilter)?.name || 'All People'}
                    <ChevronDown size={13} className={eventsFriendFilter !== 'all' ? 'text-white' : 'text-gray-400 dark:text-gray-500'} />
                  </button>
                  <SmartDropdown anchorRect={eventsFriendFilterRect} open={showEventsFriendFilter} onClose={() => setShowEventsFriendFilter(false)}>
                    <div className="max-h-64 overflow-y-auto w-48">
                      <button onClick={() => { setEventsFriendFilter('all'); setShowEventsFriendFilter(false); }} className={`w-full px-4 py-2.5 text-sm text-left text-gray-900 dark:text-gray-50 hover:bg-gray-50 dark:hover:bg-gray-700 ${eventsFriendFilter === 'all' ? 'bg-gray-50 dark:bg-gray-900 font-medium' : ''}`}>All People</button>
                      <div className="border-t border-gray-100 dark:border-gray-800">
                        {[...friends].sort((a,b) => a.name.localeCompare(b.name)).map(f => (
                          <button key={f.id} onClick={() => { setEventsFriendFilter(f.id); setShowEventsFriendFilter(false); }} className={`w-full px-4 py-2.5 text-sm text-left hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2 ${eventsFriendFilter === f.id ? 'bg-gray-50 dark:bg-gray-900 font-medium' : ''}`}>
                            {f.profilePicture ? <img src={f.profilePicture} alt={f.name} className="w-5 h-5 rounded-full object-cover flex-shrink-0" /> : <div className={`w-5 h-5 rounded-full ${getProfileColor(f.name)} text-white flex items-center justify-center text-[9px] font-medium flex-shrink-0`}>{getInitials(f.name)}</div>}
                            {f.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  </SmartDropdown>
                </div>
                {/* Date range filter */}
                <div className="relative">
                  <button onClick={(e) => { setEventsDateFilterRect(e.currentTarget.getBoundingClientRect()); setShowEventsDateFilter(!showEventsDateFilter); setShowEventsFriendFilter(false); }} className={`px-3 py-1.5 border rounded-md text-sm flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-700 ${eventsDateRange !== 'all' ? 'border-gray-900 bg-gray-900 dark:bg-gray-700 text-white hover:bg-gray-800 dark:hover:bg-gray-600' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'}`}>
                    <Calendar size={14} />
                    {eventsDateRange === 'all' ? 'All Time' : eventsDateRange === '7d' ? 'Last 7 days' : eventsDateRange === '30d' ? 'Last 30 days' : eventsDateRange === '3m' ? 'Last 3 months' : 'This year'}
                    <ChevronDown size={13} className={eventsDateRange !== 'all' ? 'text-white' : 'text-gray-400 dark:text-gray-500'} />
                  </button>
                  <SmartDropdown anchorRect={eventsDateFilterRect} open={showEventsDateFilter} onClose={() => setShowEventsDateFilter(false)}>
                    <div className="w-40">
                      {[['all', 'All Time'], ['7d', 'Last 7 days'], ['30d', 'Last 30 days'], ['3m', 'Last 3 months'], ['1y', 'This year']].map(([val, label]) => (
                        <button key={val} onClick={() => { setEventsDateRange(val); setShowEventsDateFilter(false); }} className={`w-full px-4 py-2.5 text-sm text-left text-gray-900 dark:text-gray-50 hover:bg-gray-50 dark:hover:bg-gray-700 ${eventsDateRange === val ? 'bg-gray-50 dark:bg-gray-900 font-medium' : ''}`}>{label}</button>
                      ))}
                    </div>
                  </SmartDropdown>
                </div>
                {/* Clear filters */}
                {(eventsFriendFilter !== 'all' || eventsDateRange !== 'all') && (
                  <button onClick={() => { setEventsFriendFilter('all'); setEventsDateRange('all'); }} className="px-3 py-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900">Clear</button>
                )}
              </div>
              {(() => {
                // Date range cutoff
                const now = new Date();
                const cutoff = eventsDateRange === '7d' ? new Date(now - 7*24*60*60*1000)
                  : eventsDateRange === '30d' ? new Date(now - 30*24*60*60*1000)
                  : eventsDateRange === '3m' ? new Date(now - 90*24*60*60*1000)
                  : eventsDateRange === '1y' ? new Date(now.getFullYear(), 0, 1)
                  : null;

                // Deduplicate by event ID — tagged events appear in multiple friends' logs
                // but should only show once with all involved friends listed
                const seenIds = new Set();
                const allEvents = friends.flatMap(friend =>
                  (friend.eventLog || [])
                    .filter(e => e.type !== 'system' && e.type !== 'reminder_completed')
                    .map(e => ({ ...e, friend }))
                ).filter(event => {
                  if (seenIds.has(event.id)) return false;
                  seenIds.add(event.id);
                  return true;
                }).map(event => ({
                  ...event,
                  involvedFriends: event.taggedFriendIds
                    ? event.taggedFriendIds.map(id => friends.find(f => f.id === id)).filter(Boolean)
                    : [event.friend]
                })).filter(event => {
                  if (eventsFriendFilter !== 'all' && !event.involvedFriends.some(f => f.id === eventsFriendFilter)) return false;
                  if (cutoff && parseLocalDate(event.date) < cutoff) return false;
                  return true;
                }).sort((a, b) => new Date(b.date) - new Date(a.date));

                if (allEvents.length === 0) return (
                  <div className="bg-white dark:bg-gray-800 border rounded-md p-12 text-center">
                    <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-3"><Calendar size={24} className="text-gray-400 dark:text-gray-500" /></div>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-50 mb-1">No events logged yet</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Head to a friend's page and log your first touchpoint!</p>
                  </div>
                );

                const grouped = allEvents.reduce((acc, event) => {
                  const d = parseLocalDate(event.date);
                  const rel = getRelativeDateLabel(d);
                  const dateKey = rel || d.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
                  if (!acc[dateKey]) acc[dateKey] = [];
                  acc[dateKey].push(event);
                  return acc;
                }, {});

                return (
                  <div className="space-y-6">
                    {Object.entries(grouped).map(([dateLabel, events]) => (
                      <div key={dateLabel}>
                        <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-3">{dateLabel}</p>
                        <div className="space-y-3">
                          {events.map((event, index) => (
                            <div key={event.id} className="relative pl-6 group">
                              {index !== events.length - 1 && <div className="absolute left-2 top-5 bottom-0 w-px bg-gray-200" />}
                              <div className={`absolute left-0 top-1.5 w-4 h-4 rounded-full border-2 ${index === 0 ? 'bg-gray-900 dark:bg-gray-300 border-gray-900 dark:border-gray-300' : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600'}`} />
                                <div className="bg-white dark:bg-gray-800 border rounded-md p-4 hover:border-gray-300 transition-colors">
                                <div className="flex items-start justify-between gap-3">
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900 dark:text-gray-50">{event.title}</p>
                                    <div className="flex items-center gap-1.5 flex-wrap mt-1">
                                      {event.involvedFriends.map(f => (
                                        <button key={f.id} onClick={() => { setViewingFriendId(f.id); setCurrentView('detail'); setDetailTab('profile'); }} className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 pl-0.5 pr-2 py-0.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center gap-1.5">
                                          {f.profilePicture ? <img src={f.profilePicture} alt={f.name} className="w-4 h-4 rounded-full object-cover flex-shrink-0" /> : <div className={`w-4 h-4 rounded-full ${getProfileColor(f.name)} text-white flex items-center justify-center text-[9px] font-medium flex-shrink-0`}>{getInitials(f.name)}</div>}
                                          {f.name}
                                        </button>
                                      ))}
                                    </div>
                                    {event.note && <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{event.note}</p>}
                                    {event.type === 'reminder_completed' && <span className="inline-block text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded mt-1">From check-in</span>}
                                  </div>
                                  <div className="flex items-center gap-2 flex-shrink-0">
                                    <div className="relative">
                                      <button onClick={(e) => { setEventActionsRect(e.currentTarget.getBoundingClientRect()); setEventActionsOpen(eventActionsOpen === event.id ? null : event.id); }} className="p-1.5 text-gray-400 dark:text-gray-500 hover:text-gray-600 rounded border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700"><MoreVertical size={14} /></button>
                                      <SmartDropdown anchorRect={eventActionsRect} open={eventActionsOpen === event.id} onClose={() => setEventActionsOpen(null)}>
                                        <button onClick={() => { setEditingCheckIn({ ...event, friendId: event.friend.id }); setShowEditCheckInModal(true); setEventActionsOpen(null); }} className="w-full px-4 py-2.5 text-sm text-left text-gray-900 dark:text-gray-50 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2"><Edit2 size={14} className="text-gray-400 dark:text-gray-500" />Edit</button>
                                        <button onClick={() => { setEventActionsOpen(null); if (confirm('Delete this event?')) { event.involvedFriends.forEach(f => deleteEvent(f.id, event.id)); } }} className="w-full px-4 py-2.5 text-sm text-left hover:bg-red-50 dark:hover:bg-red-950/50 text-red-600 dark:text-red-400 flex items-center gap-2"><Trash2 size={14} />Delete</button>
                                      </SmartDropdown>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })()}
            </div>
          )}

        </div>
      </div>

      {/* Global Log Event Modal */}
      {showGlobalLogModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-50">Log Event</h3>
              <button onClick={() => setShowGlobalLogModal(false)} className="text-gray-400 dark:text-gray-500 hover:text-gray-900"><X size={20} /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1.5">Title</label>
                <input type="text" placeholder="What did you do?" value={globalLogTitle} onChange={e => setGlobalLogTitle(e.target.value)} className="text-gray-900 dark:text-gray-50 placeholder-gray-400 dark:placeholder-gray-500 w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-md" autoFocus />
              </div>
              <div>
                <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1.5">People</label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search people..."
                    value={globalLogSearch}
                    onChange={e => setGlobalLogSearch(e.target.value)}
                    className="text-gray-900 dark:text-gray-50 placeholder-gray-400 dark:placeholder-gray-500 w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-md"
                  />
                  {globalLogSearch.trim() && (
                    <div className="absolute z-20 w-full mt-1 bg-white dark:bg-gray-800 border rounded-md shadow-lg max-h-48 overflow-y-auto">
                      {friends.filter(f =>
                        f.name.toLowerCase().includes(globalLogSearch.toLowerCase()) &&
                        !globalLogFriends.includes(f.id)
                      ).sort((a,b) => a.name.localeCompare(b.name)).length === 0
                        ? <p className="px-3 py-2 text-sm text-gray-400 dark:text-gray-500">No people found</p>
                        : friends.filter(f =>
                            f.name.toLowerCase().includes(globalLogSearch.toLowerCase()) &&
                            !globalLogFriends.includes(f.id)
                          ).sort((a,b) => a.name.localeCompare(b.name)).map(friend => (
                          <button key={friend.id} onClick={() => { setGlobalLogFriends([...globalLogFriends, friend.id]); setGlobalLogSearch(''); }} className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 text-left">
                            {friend.profilePicture ? <img src={friend.profilePicture} alt={friend.name} className="w-6 h-6 rounded-full object-cover flex-shrink-0" /> : <div className={`w-6 h-6 rounded-full ${getProfileColor(friend.name)} text-white flex items-center justify-center text-[10px] font-medium flex-shrink-0`}>{getInitials(friend.name)}</div>}
                            <span className="text-sm text-gray-900 dark:text-gray-50">{friend.name}</span>
                          </button>
                        ))
                      }
                    </div>
                  )}
                </div>
                {globalLogFriends.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {globalLogFriends.map(id => { const f = friends.find(fr => fr.id === id); if (!f) return null; return (
                      <span key={id} className="flex items-center gap-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded-full">
                        {f.name}
                        <button onClick={() => setGlobalLogFriends(globalLogFriends.filter(fid => fid !== id))} className="text-gray-400 dark:text-gray-500 hover:text-gray-700"><X size={10} /></button>
                      </span>
                    ); })}
                  </div>
                )}
              </div>
              <div>
                <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1.5">Date</label>
                <input type="date" value={globalLogDate} onChange={e => setGlobalLogDate(e.target.value)} className="text-gray-900 dark:text-gray-50 placeholder-gray-400 dark:placeholder-gray-500 w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-md" />
              </div>
              <div>
                <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1.5">Notes (optional)</label>
                <textarea placeholder="Any details..." value={globalLogNote} onChange={e => setGlobalLogNote(e.target.value)} className="text-gray-900 dark:text-gray-50 placeholder-gray-400 dark:placeholder-gray-500 w-full px-3 py-2 text-sm border rounded-md h-20 resize-none" />
              </div>
              <div className="flex gap-3">
                <button onClick={() => setShowGlobalLogModal(false)} className="flex-1 px-4 py-2 border rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 text-sm text-gray-700 dark:text-gray-300">Cancel</button>
                <button
                  disabled={!globalLogTitle.trim() || globalLogFriends.length === 0}
                  onClick={() => {
                    logEvent(globalLogFriends, globalLogTitle, globalLogNote, globalLogDate ? parseLocalDate(globalLogDate).toISOString() : new Date().toISOString(), []);
                    setShowGlobalLogModal(false);
                    setGlobalLogTitle(''); setGlobalLogNote(''); setGlobalLogDate(toLocalDateStr()); setGlobalLogFriends([]); setGlobalLogSearch('');
                  }}
                  className="flex-1 px-4 py-2 bg-gray-900 dark:bg-gray-700 text-white rounded-md hover:bg-gray-800 dark:hover:bg-gray-600 disabled:opacity-50 text-sm"
                >Log Event</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Friend Modal */}
      {isEditingFriend && editedFriend && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-50">Edit Friend</h3>
              <button onClick={() => { setIsEditingFriend(false); setEditedFriend(null); }} className="text-gray-400 dark:text-gray-500 hover:text-gray-900"><X size={20} /></button>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="relative">
                  {editedFriend.profilePicture ? <img src={editedFriend.profilePicture} alt="Profile" className="w-16 h-16 rounded-full object-cover" /> : <div className={`w-16 h-16 rounded-full ${getProfileColor(editedFriend.name || 'Friend')} flex items-center justify-center text-white text-xl font-bold`}>{getInitials(editedFriend.name || 'F')}</div>}
                  <label className="absolute bottom-0 right-0 bg-gray-900 dark:bg-gray-700 text-white p-1.5 rounded-full cursor-pointer hover:bg-gray-800 dark:hover:bg-gray-600"><Plus size={12} /><input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, true)} className="hidden" /></label>
                </div>
                {editedFriend.profilePicture && <button onClick={() => setEditedFriend({ ...editedFriend, profilePicture: null })} className="text-xs text-red-600 hover:text-red-700">Remove photo</button>}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="block text-xs text-gray-600 dark:text-gray-400 mb-1.5">First Name</label><input type="text" value={editedFriend.firstName} onChange={(e) => setEditedFriend({ ...editedFriend, firstName: e.target.value })} className="text-gray-900 dark:text-gray-50 placeholder-gray-400 dark:placeholder-gray-500 w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-md" autoFocus /></div>
                <div><label className="block text-xs text-gray-600 dark:text-gray-400 mb-1.5">Last Name</label><input type="text" value={editedFriend.lastName} onChange={(e) => setEditedFriend({ ...editedFriend, lastName: e.target.value })} className="text-gray-900 dark:text-gray-50 placeholder-gray-400 dark:placeholder-gray-500 w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-md" /></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="block text-xs text-gray-600 dark:text-gray-400 mb-1.5">Phone</label><input type="tel" value={editedFriend.phone || ''} onChange={(e) => setEditedFriend({ ...editedFriend, phone: e.target.value })} className="text-gray-900 dark:text-gray-50 placeholder-gray-400 dark:placeholder-gray-500 w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-md" /></div>
                <div><label className="block text-xs text-gray-600 dark:text-gray-400 mb-1.5">Email</label><input type="email" value={editedFriend.email || ''} onChange={(e) => setEditedFriend({ ...editedFriend, email: e.target.value })} className="text-gray-900 dark:text-gray-50 placeholder-gray-400 dark:placeholder-gray-500 w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-md" /></div>
              </div>
              <div><label className="block text-xs text-gray-600 dark:text-gray-400 mb-1.5">Birthday (optional)</label><input type="date" value={editedFriend.birthday || ''} onChange={(e) => setEditedFriend({ ...editedFriend, birthday: e.target.value })} className="text-gray-900 dark:text-gray-50 placeholder-gray-400 dark:placeholder-gray-500 w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-md" /></div>
              <div>
                <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1.5">Groups</label>
                <div className="relative">
                  <button type="button" onClick={() => setShowEditGroupDropdown(!showEditGroupDropdown)} className="w-full px-3 py-2 text-sm border rounded-md text-left flex items-center justify-between bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 min-h-[42px]">
                    <div className="flex flex-wrap gap-1 flex-1">{!editedFriend.groups || editedFriend.groups.length === 0 ? <span className="text-gray-500 dark:text-gray-400">None</span> : editedFriend.groups.map(groupId => { const group = getGroupById(groupId); if (!group) return null; return <span key={groupId} className="text-xs px-2 py-0.5 rounded flex items-center gap-1" style={{ backgroundColor: group.color + '20', color: group.color }}><span className="text-[10px]">{group.icon}</span><span>{group.name}</span></span>; })}</div>
                    <ChevronDown size={16} className="text-gray-400 dark:text-gray-500 flex-shrink-0 ml-2" />
                  </button>
                  {showEditGroupDropdown && (<><div className="fixed inset-0 z-10" onClick={() => setShowEditGroupDropdown(false)} /><div className="absolute z-20 w-full mt-1 bg-white dark:bg-gray-800 border rounded-md shadow-lg max-h-48 overflow-y-auto">{groups.length === 0 ? <div className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400">No groups yet.</div> : [...groups].sort((a,b)=>a.name.localeCompare(b.name)).map(group => <label key={group.id} className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"><input type="checkbox" checked={editedFriend.groups && editedFriend.groups.includes(group.id)} onChange={(e) => { const cur = editedFriend.groups || []; setEditedFriend({ ...editedFriend, groups: e.target.checked ? [...cur, group.id] : cur.filter(gr => gr !== group.id) }); }} className="rounded" /><span className="text-sm flex items-center gap-2 text-gray-900 dark:text-gray-50"><span style={{ color: group.color }}>{group.icon}</span><span>{group.name}</span></span></label>)}</div></>)}
                </div>
              </div>
              <div>
                <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1.5">Likes</label>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {(editedFriend.likes || []).map((like, i) => (
                    <span key={i} className="flex items-center gap-1 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2.5 py-1 rounded-full">
                      {like}
                      <button onClick={() => setEditedFriend({ ...editedFriend, likes: editedFriend.likes.filter((_, j) => j !== i) })} className="text-gray-400 dark:text-gray-500 hover:text-gray-700 ml-0.5"><X size={11} /></button>
                    </span>
                  ))}
                </div>
                <input
                  type="text"
                  placeholder="Add a like and press Enter..."
                  value={likesInput}
                  onChange={e => setLikesInput(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter' && likesInput.trim()) { e.preventDefault(); setEditedFriend({ ...editedFriend, likes: [...(editedFriend.likes || []), likesInput.trim()] }); setLikesInput(''); }}}
                  className="text-gray-900 dark:text-gray-50 placeholder-gray-400 dark:placeholder-gray-500 w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-md"
                />
              </div>
              <div><label className="block text-xs text-gray-600 dark:text-gray-400 mb-1.5">Notes (optional)</label><textarea placeholder="Any notes about this person..." value={editedFriend.notes || ''} onChange={(e) => setEditedFriend({ ...editedFriend, notes: e.target.value })} className="text-gray-900 dark:text-gray-50 placeholder-gray-400 dark:placeholder-gray-500 w-full px-3 py-2 text-sm border rounded-md h-20 resize-none" /></div>
              <div className="flex gap-3">
                <button onClick={() => { setIsEditingFriend(false); setEditedFriend(null); }} className="flex-1 px-4 py-2 border rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 text-sm text-gray-700 dark:text-gray-300">Cancel</button>
                <button onClick={saveEditedFriend} disabled={!editedFriend.firstName.trim()} className="flex-1 px-4 py-2 bg-gray-900 dark:bg-gray-700 text-white rounded-md hover:bg-gray-800 dark:hover:bg-gray-600 text-sm disabled:opacity-50 text-sm">Save Changes</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Friend Modal */}
      {showAddFriendModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-50">Add Person</h3>
              <button onClick={() => { setShowAddFriendModal(false); setNewFriend({ firstName: '', lastName: '', frequency: 14, groups: [], phone: '', email: '', birthday: '' }); }} className="text-gray-400 dark:text-gray-500 hover:text-gray-900"><X size={20} /></button>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="relative">
                  {newFriend.profilePicture ? <img src={newFriend.profilePicture} alt="Profile" className="w-16 h-16 rounded-full object-cover" /> : <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-gray-400 dark:text-gray-500 text-xl font-bold">+</div>}
                  <label className="absolute bottom-0 right-0 bg-gray-900 dark:bg-gray-700 text-white p-1.5 rounded-full cursor-pointer hover:bg-gray-800 dark:hover:bg-gray-600"><Plus size={12} /><input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, false)} className="hidden" /></label>
                </div>
                {newFriend.profilePicture && <button onClick={() => setNewFriend({ ...newFriend, profilePicture: null })} className="text-xs text-red-600 hover:text-red-700">Remove photo</button>}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="block text-xs text-gray-600 dark:text-gray-400 mb-1.5">First Name</label><input type="text" placeholder="First name" value={newFriend.firstName} onChange={(e) => setNewFriend({ ...newFriend, firstName: e.target.value })} className="text-gray-900 dark:text-gray-50 placeholder-gray-400 dark:placeholder-gray-500 w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-md" autoFocus /></div>
                <div><label className="block text-xs text-gray-600 dark:text-gray-400 mb-1.5">Last Name</label><input type="text" placeholder="Last name" value={newFriend.lastName} onChange={(e) => setNewFriend({ ...newFriend, lastName: e.target.value })} className="text-gray-900 dark:text-gray-50 placeholder-gray-400 dark:placeholder-gray-500 w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-md" /></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="block text-xs text-gray-600 dark:text-gray-400 mb-1.5">Phone</label><input type="tel" placeholder="Phone number" value={newFriend.phone || ''} onChange={(e) => setNewFriend({ ...newFriend, phone: e.target.value })} className="text-gray-900 dark:text-gray-50 placeholder-gray-400 dark:placeholder-gray-500 w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-md" /></div>
                <div><label className="block text-xs text-gray-600 dark:text-gray-400 mb-1.5">Email</label><input type="email" placeholder="Email address" value={newFriend.email || ''} onChange={(e) => setNewFriend({ ...newFriend, email: e.target.value })} className="text-gray-900 dark:text-gray-50 placeholder-gray-400 dark:placeholder-gray-500 w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-md" /></div>
              </div>
              <div><label className="block text-xs text-gray-600 dark:text-gray-400 mb-1.5">Birthday (optional)</label><input type="date" value={newFriend.birthday || ''} onChange={(e) => setNewFriend({ ...newFriend, birthday: e.target.value })} className="text-gray-900 dark:text-gray-50 placeholder-gray-400 dark:placeholder-gray-500 w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-md" /></div>
              <div>
                <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1.5">Groups</label>
                <div className="relative">
                  <button type="button" onClick={() => setShowGroupDropdown(!showGroupDropdown)} className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-md text-sm text-left flex items-center justify-between bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 min-h-[42px]">
                    <div className="flex flex-wrap gap-1 flex-1">{newFriend.groups.length === 0 ? <span className="text-gray-500 dark:text-gray-400">None</span> : newFriend.groups.map(groupId => { const group = getGroupById(groupId); if (!group) return null; return <span key={groupId} className="text-xs px-2 py-0.5 rounded flex items-center gap-1" style={{ backgroundColor: group.color + '20', color: group.color }}><span className="text-[10px]">{group.icon}</span><span>{group.name}</span></span>; })}</div>
                    <ChevronDown size={16} className="text-gray-400 dark:text-gray-500 flex-shrink-0 ml-2" />
                  </button>
                  {showGroupDropdown && (<><div className="fixed inset-0 z-10" onClick={() => setShowGroupDropdown(false)} /><div className="absolute z-20 w-full mt-1 bg-white dark:bg-gray-800 border rounded-md shadow-lg max-h-48 overflow-y-auto">{groups.length === 0 ? <div className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400">No groups yet.</div> : [...groups].sort((a,b)=>a.name.localeCompare(b.name)).map(group => <label key={group.id} className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"><input type="checkbox" checked={newFriend.groups.includes(group.id)} onChange={(e) => { setNewFriend({ ...newFriend, groups: e.target.checked ? [...newFriend.groups, group.id] : newFriend.groups.filter(gr => gr !== group.id) }); }} className="rounded" /><span className="text-sm flex items-center gap-2 text-gray-900 dark:text-gray-50"><span style={{ color: group.color }}>{group.icon}</span><span>{group.name}</span></span></label>)}</div></>)}
                </div>
              </div>
              <div>
                <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1.5">Likes</label>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {(newFriend.likes || []).map((like, i) => (
                    <span key={i} className="flex items-center gap-1 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2.5 py-1 rounded-full">
                      {like}
                      <button onClick={() => setNewFriend({ ...newFriend, likes: newFriend.likes.filter((_, j) => j !== i) })} className="text-gray-400 dark:text-gray-500 hover:text-gray-700 ml-0.5"><X size={11} /></button>
                    </span>
                  ))}
                </div>
                <input
                  type="text"
                  placeholder="Add a like and press Enter..."
                  value={likesInput}
                  onChange={e => setLikesInput(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter' && likesInput.trim()) { e.preventDefault(); setNewFriend({ ...newFriend, likes: [...(newFriend.likes || []), likesInput.trim()] }); setLikesInput(''); }}}
                  className="text-gray-900 dark:text-gray-50 placeholder-gray-400 dark:placeholder-gray-500 w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-md"
                />
              </div>
              <div><label className="block text-xs text-gray-600 dark:text-gray-400 mb-1.5">Notes (optional)</label><textarea placeholder="Any notes about this person..." value={newFriend.notes || ''} onChange={(e) => setNewFriend({ ...newFriend, notes: e.target.value })} className="text-gray-900 dark:text-gray-50 placeholder-gray-400 dark:placeholder-gray-500 w-full px-3 py-2 text-sm border rounded-md h-20 resize-none" /></div>
              <div className="flex gap-3">
                <button onClick={() => { setShowAddFriendModal(false); setNewFriend({ firstName: '', lastName: '', frequency: 14, groups: [], phone: '', email: '', birthday: '' }); }} className="flex-1 px-4 py-2 border rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 text-sm text-gray-700 dark:text-gray-300">Cancel</button>
                <button onClick={addFriend} disabled={!newFriend.firstName.trim()} className="flex-1 px-4 py-2 bg-gray-900 dark:bg-gray-700 text-white rounded-md hover:bg-gray-800 dark:hover:bg-gray-600 text-sm disabled:opacity-50 text-sm">Add Person</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Group Modal */}
      {showGroupModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4"><h3 className="text-lg font-semibold text-gray-900 dark:text-gray-50">Add Group</h3><button onClick={() => { setShowGroupModal(false); setNewGroupName(''); setNewGroupDescription(''); setNewGroupColor(''); setNewGroupIcon(''); }} className="text-gray-400 dark:text-gray-500 hover:text-gray-900"><X size={20} /></button></div>
            <div className="space-y-4">
              <div><label className="block text-xs text-gray-600 dark:text-gray-400 mb-1.5">Name</label><input type="text" placeholder="e.g., Family, Work, College People" value={newGroupName} onChange={(e) => setNewGroupName(e.target.value)} className="text-gray-900 dark:text-gray-50 placeholder-gray-400 dark:placeholder-gray-500 w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-md text-sm" autoFocus /></div>
              <div><label className="block text-xs text-gray-600 dark:text-gray-400 mb-1.5">Description (optional)</label><textarea placeholder="What's this group about?" value={newGroupDescription} onChange={(e) => setNewGroupDescription(e.target.value)} className="text-gray-900 dark:text-gray-50 placeholder-gray-400 dark:placeholder-gray-500 w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-md text-sm h-20 resize-none" /></div>
              <div><label className="block text-xs text-gray-600 dark:text-gray-400 mb-1.5">Icon</label><div className="flex flex-wrap gap-2">{groupIconPresets.map(icon => <button key={icon} type="button" onClick={() => setNewGroupIcon(icon)} className={`w-10 h-10 rounded-md flex items-center justify-center text-xl border-2 ${newGroupIcon===icon?'border-gray-900 bg-gray-50 dark:bg-gray-900':'border-gray-200 dark:border-gray-700 hover:border-gray-300'}`}>{icon}</button>)}</div></div>
              <div><label className="block text-xs text-gray-600 dark:text-gray-400 mb-1.5">Color</label><div className="flex flex-wrap gap-2">{groupColorPresets.map(color => <button key={color} type="button" onClick={() => setNewGroupColor(color)} className={`w-10 h-10 rounded-md border-2 ${newGroupColor===color?'border-gray-900 ring-2 ring-offset-2 ring-gray-200':'border-transparent'}`} style={{ backgroundColor: color }} />)}</div></div>
              <div>
                <label className="block text-xs text-gray-600 dark:text-gray-400 mb-2">Members (optional)</label>
                {newGroupMembers.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {newGroupMembers.map(id => { const f = friends.find(f => f.id === id); if (!f) return null; return (
                      <span key={id} className="flex items-center gap-1.5 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2.5 py-1 rounded-full">
                        <div className={`w-4 h-4 rounded-full ${getProfileColor(f.name)} text-white flex items-center justify-center text-[9px] font-medium flex-shrink-0`}>{getInitials(f.name)}</div>
                        {f.name}
                        <button onClick={() => setNewGroupMembers(newGroupMembers.filter(id2 => id2 !== id))} className="text-gray-400 dark:text-gray-500 hover:text-gray-700 ml-0.5"><X size={11} /></button>
                      </span>
                    ); })}
                  </div>
                )}
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search people to add..."
                    value={groupMemberSearch}
                    onChange={e => setGroupMemberSearch(e.target.value)}
                    className="text-gray-900 dark:text-gray-50 placeholder-gray-400 dark:placeholder-gray-500 w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-md"
                  />
                  {groupMemberSearch.trim() && (
                    <div className="absolute left-0 right-0 top-full mt-1 border rounded-md bg-white dark:bg-gray-800 shadow-lg divide-y dark:divide-gray-700 max-h-40 overflow-y-auto z-10">
                      {friends.filter(f => !newGroupMembers.includes(f.id) && f.name.toLowerCase().includes(groupMemberSearch.toLowerCase())).map(f => (
                        <button key={f.id} onClick={() => { setNewGroupMembers([...newGroupMembers, f.id]); setGroupMemberSearch(''); }} className="w-full flex items-center gap-2 px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 text-left">
                          <div className={`w-6 h-6 rounded-full ${getProfileColor(f.name)} text-white flex items-center justify-center text-xs font-medium flex-shrink-0`}>{getInitials(f.name)}</div>
                          <span className="text-sm text-gray-900 dark:text-gray-50">{f.name}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex gap-3"><button onClick={() => { setShowGroupModal(false); setNewGroupName(''); setNewGroupDescription(''); setNewGroupColor(''); setNewGroupIcon(''); setNewGroupMembers([]); setGroupMemberSearch(''); }} className="flex-1 px-4 py-2 border rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 text-sm text-gray-700 dark:text-gray-300">Cancel</button><button onClick={addGroup} disabled={!newGroupName.trim()} className="flex-1 px-4 py-2 bg-gray-900 dark:bg-gray-700 text-white rounded-md hover:bg-gray-800 dark:hover:bg-gray-600 text-sm disabled:opacity-50 text-sm">Add Group</button></div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Group Modal */}
      {showEditGroupModal && editingGroup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4"><h3 className="text-lg font-semibold text-gray-900 dark:text-gray-50">Edit Group</h3><button onClick={() => { setShowEditGroupModal(false); setEditingGroup(null); }} className="text-gray-400 dark:text-gray-500 hover:text-gray-900"><X size={20} /></button></div>
            <div className="space-y-4">
              <div><label className="block text-xs text-gray-600 dark:text-gray-400 mb-1.5">Name</label><input type="text" value={editingGroup.name} onChange={(e) => setEditingGroup({ ...editingGroup, name: e.target.value })} className="text-gray-900 dark:text-gray-50 placeholder-gray-400 dark:placeholder-gray-500 w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-md text-sm" autoFocus /></div>
              <div><label className="block text-xs text-gray-600 dark:text-gray-400 mb-1.5">Description (optional)</label><textarea placeholder="What's this group about?" value={editingGroup.description || ''} onChange={(e) => setEditingGroup({ ...editingGroup, description: e.target.value })} className="text-gray-900 dark:text-gray-50 placeholder-gray-400 dark:placeholder-gray-500 w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-md text-sm h-20 resize-none" /></div>
              <div><label className="block text-xs text-gray-600 dark:text-gray-400 mb-1.5">Icon</label><div className="flex flex-wrap gap-2">{groupIconPresets.map(icon => <button key={icon} type="button" onClick={() => setEditingGroup({ ...editingGroup, icon })} className={`w-10 h-10 rounded-md flex items-center justify-center text-xl border-2 ${editingGroup.icon===icon?'border-gray-900 bg-gray-50 dark:bg-gray-900':'border-gray-200 dark:border-gray-700 hover:border-gray-300'}`}>{icon}</button>)}</div></div>
              <div><label className="block text-xs text-gray-600 dark:text-gray-400 mb-1.5">Color</label><div className="flex flex-wrap gap-2">{groupColorPresets.map(color => <button key={color} type="button" onClick={() => setEditingGroup({ ...editingGroup, color })} className={`w-10 h-10 rounded-md border-2 ${editingGroup.color===color?'border-gray-900 ring-2 ring-offset-2 ring-gray-200':'border-transparent'}`} style={{ backgroundColor: color }} />)}</div></div>
              <div>
                <label className="block text-xs text-gray-600 dark:text-gray-400 mb-2">Members</label>
                {(() => {
                  const memberIds = friends.filter(f => f.groups?.includes(editingGroup.id)).map(f => f.id);
                  const toggleMember = (friendId) => {
                    setFriends(friends.map(f => {
                      if (f.id !== friendId) return f;
                      const cur = f.groups || [];
                      return { ...f, groups: cur.includes(editingGroup.id) ? cur.filter(gId => gId !== editingGroup.id) : [...cur, editingGroup.id] };
                    }));
                  };
                  const results = groupMemberSearch.trim()
                    ? friends.filter(f => !memberIds.includes(f.id) && f.name.toLowerCase().includes(groupMemberSearch.toLowerCase()))
                    : [];
                  return (
                    <>
                      {memberIds.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-2">
                          {memberIds.map(id => { const f = friends.find(f => f.id === id); if (!f) return null; return (
                            <span key={id} className="flex items-center gap-1.5 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2.5 py-1 rounded-full">
                              <div className={`w-4 h-4 rounded-full ${getProfileColor(f.name)} text-white flex items-center justify-center text-[9px] font-medium flex-shrink-0`}>{getInitials(f.name)}</div>
                              {f.name}
                              <button onClick={() => toggleMember(id)} className="text-gray-400 dark:text-gray-500 hover:text-gray-700 ml-0.5"><X size={11} /></button>
                            </span>
                          ); })}
                        </div>
                      )}
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="Search people to add..."
                          value={groupMemberSearch}
                          onChange={e => setGroupMemberSearch(e.target.value)}
                          className="text-gray-900 dark:text-gray-50 placeholder-gray-400 dark:placeholder-gray-500 w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-md"
                        />
                        {results.length > 0 && (
                          <div className="absolute left-0 right-0 top-full mt-1 border rounded-md bg-white dark:bg-gray-800 shadow-lg divide-y dark:divide-gray-700 max-h-40 overflow-y-auto z-10">
                            {results.map(f => (
                              <button key={f.id} onClick={() => { toggleMember(f.id); setGroupMemberSearch(''); }} className="w-full flex items-center gap-2 px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 text-left">
                                <div className={`w-6 h-6 rounded-full ${getProfileColor(f.name)} text-white flex items-center justify-center text-xs font-medium flex-shrink-0`}>{getInitials(f.name)}</div>
                                <span className="text-sm">{f.name}</span>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </>
                  );
                })()}
              </div>
              <div className="flex gap-3"><button onClick={() => { setShowEditGroupModal(false); setEditingGroup(null); }} className="flex-1 px-4 py-2 border rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 text-sm text-gray-700 dark:text-gray-300">Cancel</button><button onClick={saveEditGroup} disabled={!editingGroup.name?.trim()} className="flex-1 px-4 py-2 bg-gray-900 dark:bg-gray-700 text-white rounded-md hover:bg-gray-800 dark:hover:bg-gray-600 text-sm disabled:opacity-50 text-sm">Save</button></div>
            </div>
          </div>
        </div>
      )}

      {/* Check-in Modal */}
      {showCheckInModal && viewingFriend && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4"><h3 className="text-lg font-semibold text-gray-900 dark:text-gray-50">{modalType==='reminder' ? (editingReminder ? 'Edit Check-in' : 'Add Check-in') : 'Log Event'}</h3><button onClick={() => { setShowCheckInModal(false); setEditingReminder(null); setCheckInTitle(''); setCheckInNote(''); setIsRecurring(false); setRecurringPeriod(7); }} className="text-gray-400 dark:text-gray-500 hover:text-gray-900"><X size={20} /></button></div>
            <div className="space-y-4">
              <div><label className="block text-xs text-gray-600 dark:text-gray-400 mb-1.5">Title</label><input type="text" placeholder={modalType==='reminder'?'e.g., Call about job interview':'e.g., Coffee catch-up, Phone call'} value={checkInTitle} onChange={(e) => setCheckInTitle(e.target.value)} className="text-gray-900 dark:text-gray-50 placeholder-gray-400 dark:placeholder-gray-500 w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-md text-sm" autoFocus /></div>
              <div><label className="block text-xs text-gray-600 dark:text-gray-400 mb-1.5">Date</label><input type="date" value={checkInDate} onChange={(e) => setCheckInDate(e.target.value)} className="text-gray-900 dark:text-gray-50 placeholder-gray-400 dark:placeholder-gray-500 w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-md text-sm" /></div>
              {modalType==='reminder' && (<><div><label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={isRecurring} onChange={(e) => setIsRecurring(e.target.checked)} className="rounded" /><span className="text-sm text-gray-700 dark:text-gray-300">Recurring check-in</span></label></div>{isRecurring && <div><label className="block text-xs text-gray-600 dark:text-gray-400 mb-1.5">Repeat every</label><select value={recurringPeriod} onChange={(e) => setRecurringPeriod(parseInt(e.target.value))} className="text-gray-900 dark:text-gray-50 placeholder-gray-400 dark:placeholder-gray-500 w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-md text-sm"><option value="7">Week</option><option value="14">2 weeks</option><option value="30">Month</option><option value="60">2 months</option><option value="90">3 months</option></select></div>}</>)}
              {modalType==='event' && viewingFriend && (
                <div>
                  <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1.5">Tag other people (optional)</label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search people..."
                      value={taggedFriendsSearch}
                      onChange={e => setTaggedFriendsSearch(e.target.value)}
                      className="text-gray-900 dark:text-gray-50 placeholder-gray-400 dark:placeholder-gray-500 w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-md"
                    />
                    {taggedFriendsSearch.trim() && (
                      <div className="absolute z-20 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg max-h-48 overflow-y-auto">
                        {friends.filter(f => f.id !== viewingFriend.id && f.name.toLowerCase().includes(taggedFriendsSearch.toLowerCase()) && !taggedFriends.includes(f.id)).sort((a,b) => a.name.localeCompare(b.name)).length === 0
                          ? <p className="px-3 py-2 text-sm text-gray-400 dark:text-gray-500">No people found</p>
                          : friends.filter(f => f.id !== viewingFriend.id && f.name.toLowerCase().includes(taggedFriendsSearch.toLowerCase()) && !taggedFriends.includes(f.id)).sort((a,b) => a.name.localeCompare(b.name)).map(friend => (
                            <button key={friend.id} onClick={() => { setTaggedFriends([...taggedFriends, friend.id]); setTaggedFriendsSearch(''); }} className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 text-left">
                              {friend.profilePicture ? <img src={friend.profilePicture} alt={friend.name} className="w-6 h-6 rounded-full object-cover flex-shrink-0" /> : <div className={`w-6 h-6 rounded-full ${getProfileColor(friend.name)} text-white flex items-center justify-center text-[10px] font-medium flex-shrink-0`}>{getInitials(friend.name)}</div>}
                              <span className="text-sm text-gray-900 dark:text-gray-50">{friend.name}</span>
                            </button>
                          ))
                        }
                      </div>
                    )}
                  </div>
                  {taggedFriends.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {taggedFriends.map(id => { const f = friends.find(fr => fr.id === id); if (!f) return null; return (
                        <span key={id} className="flex items-center gap-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded-full">
                          {f.name}
                          <button onClick={() => setTaggedFriends(taggedFriends.filter(fid => fid !== id))} className="text-gray-400 dark:text-gray-500 hover:text-gray-700"><X size={10} /></button>
                        </span>
                      ); })}
                    </div>
                  )}
                  {taggedFriends.length > 0 && <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">This event will be added to {taggedFriends.length+1} {taggedFriends.length+1!==1?'people':'person'}</p>}
                </div>
              )}
              <div><label className="block text-xs text-gray-600 dark:text-gray-400 mb-1.5">Notes (optional)</label><textarea placeholder={modalType==='reminder'?'Add any context for the check-in':'What did you talk about?'} value={checkInNote} onChange={(e) => setCheckInNote(e.target.value)} className="text-gray-900 dark:text-gray-50 placeholder-gray-400 dark:placeholder-gray-500 w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-md text-sm h-24 resize-none" /></div>
              <div className="flex gap-3">
                <button onClick={() => { setShowCheckInModal(false); setEditingReminder(null); setCheckInTitle(''); setCheckInNote(''); setIsRecurring(false); setRecurringPeriod(7); setTaggedFriendsSearch(''); }} className="flex-1 px-4 py-2 border rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 text-sm text-gray-700 dark:text-gray-300">Cancel</button>
                <button onClick={() => { if (modalType==='reminder') { if (editingReminder) { updateReminder(viewingFriend.id, editingReminder.id, checkInTitle||'Check in', checkInDate?parseLocalDate(checkInDate).toISOString():new Date().toISOString(), isRecurring, recurringPeriod); } else { addReminder(viewingFriend.id, checkInTitle||'Check in', checkInDate?parseLocalDate(checkInDate).toISOString():new Date().toISOString(), isRecurring, recurringPeriod); } } else { logEvent(viewingFriend.id, checkInTitle||'Touchpoint', checkInNote, checkInDate?parseLocalDate(checkInDate).toISOString():new Date().toISOString(), taggedFriends); setShowCheckInModal(false); setCheckInTitle(''); setCheckInNote(''); setIsRecurring(false); setRecurringPeriod(7); setTaggedFriends([]); setTaggedFriendsSearch(''); } }} className="flex-1 px-4 py-2 bg-gray-900 dark:bg-gray-700 text-white rounded-md hover:bg-gray-800 dark:hover:bg-gray-600 text-sm">{modalType==='reminder' ? (editingReminder ? 'Save Check-in' : 'Add Check-in') : 'Log Event'}</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Check-in Modal */}
      {showEditCheckInModal && editingCheckIn && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4"><h3 className="text-lg font-semibold text-gray-900 dark:text-gray-50">Edit Event</h3><button onClick={() => { setShowEditCheckInModal(false); setEditingCheckIn(null); setEditCheckInFriendSearch(''); }} className="text-gray-400 dark:text-gray-500 hover:text-gray-900"><X size={20} /></button></div>
            <div className="space-y-4">
              <div><label className="block text-xs text-gray-600 dark:text-gray-400 mb-1.5">Title</label><input type="text" value={editingCheckIn.title} onChange={(e) => setEditingCheckIn({ ...editingCheckIn, title: e.target.value })} className="text-gray-900 dark:text-gray-50 placeholder-gray-400 dark:placeholder-gray-500 w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-md text-sm" autoFocus /></div>
              <div>
                <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1.5">People</label>
                <div className="relative">
                  <input type="text" placeholder="Search people..." value={editCheckInFriendSearch} onChange={e => setEditCheckInFriendSearch(e.target.value)} className="text-gray-900 dark:text-gray-50 placeholder-gray-400 dark:placeholder-gray-500 w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-md" />
                  {editCheckInFriendSearch.trim() && (
                    <div className="absolute z-20 w-full mt-1 bg-white dark:bg-gray-800 border rounded-md shadow-lg max-h-48 overflow-y-auto">
                      {friends.filter(f => f.name.toLowerCase().includes(editCheckInFriendSearch.toLowerCase()) && !(editingCheckIn.taggedFriendIds || []).includes(f.id))
                        .sort((a,b) => a.name.localeCompare(b.name)).length === 0
                        ? <p className="px-3 py-2 text-sm text-gray-400 dark:text-gray-500">No people found</p>
                        : friends.filter(f => f.name.toLowerCase().includes(editCheckInFriendSearch.toLowerCase()) && !(editingCheckIn.taggedFriendIds || []).includes(f.id))
                            .sort((a,b) => a.name.localeCompare(b.name)).map(friend => (
                          <button key={friend.id} onClick={() => { setEditingCheckIn({ ...editingCheckIn, taggedFriendIds: [...(editingCheckIn.taggedFriendIds || []), friend.id] }); setEditCheckInFriendSearch(''); }} className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 text-left">
                            {friend.profilePicture ? <img src={friend.profilePicture} alt={friend.name} className="w-6 h-6 rounded-full object-cover flex-shrink-0" /> : <div className={`w-6 h-6 rounded-full ${getProfileColor(friend.name)} text-white flex items-center justify-center text-[10px] font-medium flex-shrink-0`}>{getInitials(friend.name)}</div>}
                            <span className="text-sm text-gray-900 dark:text-gray-50">{friend.name}</span>
                          </button>
                        ))
                      }
                    </div>
                  )}
                </div>
                {(editingCheckIn.taggedFriendIds || []).length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {(editingCheckIn.taggedFriendIds || []).map(id => { const f = friends.find(fr => fr.id === id); if (!f) return null; return (
                      <span key={id} className="flex items-center gap-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded-full">
                        {f.name}
                        <button onClick={() => setEditingCheckIn({ ...editingCheckIn, taggedFriendIds: editingCheckIn.taggedFriendIds.filter(fid => fid !== id) })} className="text-gray-400 dark:text-gray-500 hover:text-gray-700"><X size={10} /></button>
                      </span>
                    ); })}
                  </div>
                )}
              </div>
              <div><label className="block text-xs text-gray-600 dark:text-gray-400 mb-1.5">Date</label><input type="date" value={toLocalDateStr(parseLocalDate(editingCheckIn.date))} onChange={(e) => setEditingCheckIn({ ...editingCheckIn, date: e.target.value })} className="text-gray-900 dark:text-gray-50 placeholder-gray-400 dark:placeholder-gray-500 w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-md text-sm" /></div>
              <div><label className="block text-xs text-gray-600 dark:text-gray-400 mb-1.5">Notes (optional)</label><textarea value={editingCheckIn.note} onChange={(e) => setEditingCheckIn({ ...editingCheckIn, note: e.target.value })} className="text-gray-900 dark:text-gray-50 placeholder-gray-400 dark:placeholder-gray-500 w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-md text-sm h-20 resize-none" /></div>
              <div className="flex gap-3">
                <button onClick={() => { setShowEditCheckInModal(false); setEditingCheckIn(null); setEditCheckInFriendSearch(''); }} className="flex-1 px-4 py-2 border rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 text-sm text-gray-700 dark:text-gray-300">Cancel</button>
                <button onClick={() => { updateEvent(editingCheckIn.id, editingCheckIn.title, editingCheckIn.note, parseLocalDate(editingCheckIn.date).toISOString(), editingCheckIn.taggedFriendIds); setEditCheckInFriendSearch(''); }} disabled={!editingCheckIn.title.trim() || !(editingCheckIn.taggedFriendIds || []).length} className="flex-1 px-4 py-2 bg-gray-900 dark:bg-gray-700 text-white rounded-md hover:bg-gray-800 dark:hover:bg-gray-600 text-sm disabled:opacity-50">Save</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Bottom Nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 z-30 flex">
        {[
          { page: 'dashboard', icon: <Home size={20} />, label: 'Home' },
          { page: 'friends', icon: <UserCircle size={20} />, label: 'People' },
          { page: 'groups', icon: <Network size={20} />, label: 'Groups' },
          { page: 'events', icon: <Calendar size={20} />, label: 'Events' },
        ].map(({ page, icon, label }) => (
          <button key={page} onClick={() => { setCurrentPage(page); setCurrentView('home'); }} className={`flex-1 flex flex-col items-center justify-center py-2.5 gap-1 text-xs font-medium transition-colors ${currentPage === page ? 'text-gray-900 dark:text-gray-50' : 'text-gray-400 dark:text-gray-500'}`}>
            {icon}
            <span>{label}</span>
          </button>
        ))}
      </div>

    </div>
  );
}
