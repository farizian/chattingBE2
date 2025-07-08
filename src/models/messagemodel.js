/* eslint-disable max-len */
// menghandle query table messages dengan Supabase
const supabase = require('../config/supabase');

const messagemodel = {
  gettotal: async () => {
    const { count, error } = await supabase
      .from('messages')
      .select('*', { count: 'exact', head: true });
    
    if (error) throw error;
    return count;
  },

  getmsg: async (sender, receiver) => {
    const { data, error } = await supabase
      .from('messages')
      .select(`
        id,
        sender,
        receiver,
        text_msg,
        created_at,
        sender_profile:users!messages_sender_fkey(username, img),
        receiver_profile:users!messages_receiver_fkey(username, img)
      `)
      .or(`and(sender.eq.${sender},receiver.eq.${receiver}),and(sender.eq.${receiver},receiver.eq.${sender})`)
      .order('created_at', { ascending: true });

    if (error) throw error;

    // Transform data to match the expected format
    const transformedData = data.map(msg => ({
      id: msg.id,
      sender: msg.sender,
      senderName: msg.sender_profile?.username,
      senderImg: msg.sender_profile?.img,
      receiver: msg.receiver,
      username: msg.receiver_profile?.username,
      img: msg.receiver_profile?.img,
      text_msg: msg.text_msg,
      created: msg.created_at
    }));

    return { rows: transformedData };
  },

  insert: async (payload) => {
    const { sender, receiver, msg } = payload;
    const { data, error } = await supabase
      .from('messages')
      .insert({
        sender,
        receiver,
        text_msg: msg
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  delMsg: async (id) => {
    const { data, error } = await supabase
      .from('messages')
      .delete()
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  update: async (body) => {
    const { sender, receiver, msg } = body;
    const { data, error } = await supabase
      .from('messages')
      .update({ text_msg: msg })
      .or(`and(sender.eq.${sender},receiver.eq.${receiver}),and(sender.eq.${receiver},receiver.eq.${sender})`)
      .select();

    if (error) throw error;
    return data;
  },
};

module.exports = messagemodel;