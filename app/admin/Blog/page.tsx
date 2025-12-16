"use client";
import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function BlogAdminPage() {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    title: "",
    category: "",
    excerpt: "",
    content: "",
    author: "",
    image: "",
    status: "draft",
  });
  const [preview, setPreview] = useState<string>("");

  // Fetch blog posts
  const fetchBlogs = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBlogs(data || []);
    } catch (error) {
      console.error('Error fetching blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
        setForm({ ...form, image: reader.result as string }); // store Base64 for now
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const blogData = {
        title: form.title,
        slug: form.title.toLowerCase().replace(/\s+/g, '-'),
        excerpt: form.excerpt || form.content.substring(0, 150),
        content: form.content,
        author: form.author || 'Admin',
        featured_image: form.image,
        category: form.category,
        tags: [],
        published: form.status === 'published',
        published_at: form.status === 'published' ? new Date().toISOString() : null,
      };

      const { data, error } = await supabase
        .from('blog_posts')
        .insert([blogData])
        .select()
        .single();

      if (error) throw error;

      await fetchBlogs();
      setForm({ title: "", category: "", excerpt: "", content: "", author: "", image: "", status: "draft" });
      setPreview("");
      alert('Blog post added successfully!');
    } catch (error: any) {
      console.error('Error adding blog:', error);
      alert('Failed to add blog post: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBlog = async (id: string) => {
    if (!confirm('Are you sure you want to delete this blog post?')) return;

    try {
      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      await fetchBlogs();
    } catch (error: any) {
      console.error('Error deleting blog:', error);
      alert('Failed to delete blog post: ' + error.message);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6">Blog Posts</h2>

      {/* Add Blog Form */}
      <div className="mb-8 p-6 bg-white rounded-xl shadow-md dark:bg-gray-900">
        <h3 className="text-xl font-semibold mb-4">Add New Blog Post</h3>
        <form onSubmit={handleAddBlog} className="space-y-4">
          <input
            type="text"
            name="title"
            placeholder="Blog Title"
            value={form.title}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
            required
          />
          <input
            type="text"
            name="category"
            placeholder="Category"
            value={form.category}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
          />
          <input
            type="text"
            name="author"
            placeholder="Author Name"
            value={form.author}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
          />
          <textarea
            name="excerpt"
            placeholder="Brief excerpt (optional)..."
            value={form.excerpt}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg h-20"
          />
          <textarea
            name="content"
            placeholder="Write your content here..."
            value={form.content}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg h-40"
            required
          />

          {/* Image Upload */}
          <div>
            <label className="block mb-1 font-medium text-gray-700 dark:text-gray-300">
              Upload Featured Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="w-full p-2 border rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-800"
            />
            {preview && (
              <img
                src={preview}
                alt="Preview"
                className="mt-3 w-full h-48 object-cover rounded-lg border"
              />
            )}
          </div>

          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
          <button
            type="submit"
            className="py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Add Blog
          </button>
        </form>
      </div>

      {/* Blog Table */}
      <div className="bg-white rounded-xl shadow-md dark:bg-gray-900 overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b">
              <th className="p-2">Image</th>
              <th className="p-2">Title</th>
              <th className="p-2">Author</th>
              <th className="p-2">Category</th>
              <th className="p-2">Status</th>
              <th className="p-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {blogs.length ? (
              blogs.map((blog) => (
                <tr
                  key={blog.id}
                  className="border-b hover:bg-gray-50 dark:hover:bg-gray-800/30"
                >
                  <td className="p-2">
                    {blog.featured_image || blog.image ? (
                      <img
                        src={blog.featured_image || blog.image}
                        alt={blog.title}
                        className="w-16 h-16 object-cover rounded-md"
                      />
                    ) : (
                      <span className="text-gray-400 italic">No image</span>
                    )}
                  </td>
                  <td className="p-2">{blog.title}</td>
                  <td className="p-2 text-gray-600 dark:text-gray-400">{blog.author}</td>
                  <td className="p-2">{blog.category}</td>
                  <td className="p-2 capitalize">
                    <span className={`px-2 py-1 text-xs rounded-lg font-medium ${
                      blog.published
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-700"
                    }`}>
                      {blog.published ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className="p-2 text-right">
                    <button
                      onClick={() => handleDeleteBlog(blog.id)}
                      className="px-3 py-1 text-sm text-white bg-red-500 rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="p-4 text-center text-gray-500">
                  No blog posts yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
