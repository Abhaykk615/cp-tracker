const supabase = require('../supabase/supabaseClient')

class userService {
  static async updateProfile(id, profileData) {
    const { data, error } = await supabase
      .from('profiles')
      .upsert({
        id: id,
        ...profileData,
        updated_at: new Date()
      })
      .select('*');
    if (error) {
      throw new Error(error.message);
    }
    return data;
  }

  static async getEmail(id) {
    const { data, error } = await supabase
      .from('auth.users')
      .select('email')
      .eq('id', id)
  
    if (error) throw new Error(error.message);
    return data?.email;
  }
  
  static async getProfile(id) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)

      if (error) {
        // If table doesn't exist, create it
        if (error.message.includes('not found') || error.message.includes('profiles')) {
          console.log('Profiles table not found, creating...');
          await this.createProfilesTable();
          // Try again after creating table
          const { data: retryData, error: retryError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', id);
          if (retryError) throw new Error(retryError.message);
          return retryData;
        }
        throw new Error(error.message);
      }
      
      // If no profile exists, create an empty one
      if (!data || data.length === 0) {
        const { data: newProfile, error: insertError } = await supabase
          .from('profiles')
          .insert({
            id: id,
            created_at: new Date(),
            updated_at: new Date()
          })
          .select('*');
        
        if (insertError) throw new Error(insertError.message);
        return newProfile;
      }
      
      return data;
    } catch (error) {
      throw error;
    }
  }

  static async createProfilesTable() {
    // This will be handled through Supabase API or manual SQL
    // For now, return a promise that resolves
    console.log('Note: Please create profiles table in Supabase manually or via admin panel');
    return Promise.resolve();
  }
}

module.exports = userService;