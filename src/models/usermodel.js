/* eslint-disable max-len */
// menghandle query table users dengan Supabase
const supabase = require('../config/supabase');

const usermodel = {
  gettotal: async () => {
    const { count, error } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true });
    
    if (error) throw error;
    return count;
  },

  getlist: async (search, field, sort, limit, offset) => {
    let query = supabase
      .from('users')
      .select('*');

    if (search) {
      query = query.ilike('username', `%${search}%`);
    }

    query = query
      .order(field, { ascending: sort === 'asc' })
      .range(offset, offset + limit - 1);

    const { data, error } = await query;
    if (error) throw error;
    return { rows: data };
  },

  login: async (body) => {
    const { email } = body;
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return { rows: data ? [data] : [] };
  },

  register: async (body, pass, img) => {
    const { data, error } = await supabase
      .from('users')
      .insert({
        img,
        username: body.username,
        email: body.email,
        password: pass
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  checkregister: async (body) => {
    const { data, error } = await supabase
      .from('users')
      .select('email')
      .eq('email', body.email)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return { rows: data ? [data] : [] };
  },

  getdetail: async (id) => {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return { rows: [data] };
  },

  detailByName: async (name) => {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('username', name)
      .single();

    if (error) throw error;
    return { rows: [data] };
  },

  getimg: async (id) => {
    const { data, error } = await supabase
      .from('users')
      .select('img')
      .eq('id', id)
      .single();

    if (error) throw error;
    return { rows: [data] };
  },

  insert: async (img, body, password) => {
    const { username, email, phone, tag } = body;
    const { data, error } = await supabase
      .from('users')
      .insert({
        img,
        username,
        email,
        password,
        phone,
        tagname: tag
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  del: async (id) => {
    const { data, error } = await supabase
      .from('users')
      .delete()
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  updatePw: async (id, pw) => {
    const { data, error } = await supabase
      .from('users')
      .update({ password: pw })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  updateEmail: async (id, email) => {
    const { data, error } = await supabase
      .from('users')
      .update({ email })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  update: async (id, img, body) => {
    const { username, phone, tagName, bio } = body;
    const { data, error } = await supabase
      .from('users')
      .update({
        img,
        username,
        phone,
        tagname: tagName,
        bio
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },
};

module.exports = usermodel;