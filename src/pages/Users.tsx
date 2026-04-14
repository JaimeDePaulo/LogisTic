import React, { useState, useEffect } from 'react';
import { Users as UsersIcon, UserPlus, Search, Edit2, Trash2, Shield, ShieldCheck, X, Mail, Lock, User as UserIcon } from 'lucide-react';
import { collection, onSnapshot, query, doc, updateDoc, deleteDoc, setDoc } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
// @ts-ignore
import firebaseConfig from '../../firebase-applet-config.json';
import { User } from '../types';
import { cn } from '../lib/utils';

export default function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user' as 'admin' | 'user'
  });

  useEffect(() => {
    const q = query(collection(db, 'users'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const usersData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as User));
      setUsers(usersData);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'users');
    });

    return () => unsubscribe();
  }, []);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    
    try {
      // Use a secondary app instance to create user without logging out current admin
      const secondaryApp = initializeApp(firebaseConfig, 'Secondary');
      const secondaryAuth = getAuth(secondaryApp);
      
      const userCredential = await createUserWithEmailAndPassword(
        secondaryAuth, 
        formData.email, 
        formData.password
      );
      
      const uid = userCredential.user.uid;
      
      // Create user profile in Firestore
      const newUser: User = {
        id: uid,
        uid: uid,
        name: formData.name,
        email: formData.email,
        role: formData.role,
        createdAt: new Date().toISOString()
      };
      
      await setDoc(doc(db, 'users', uid), newUser);
      
      // Sign out from secondary app and delete it
      await signOut(secondaryAuth);
      
      setIsModalOpen(false);
      setFormData({ name: '', email: '', password: '', role: 'user' });
      alert('Usuário criado com sucesso!');
    } catch (error: any) {
      console.error("Error creating user:", error);
      alert(`Erro ao criar usuário: ${error.message}`);
    } finally {
      setCreating(false);
    }
  };

  const toggleRole = async (user: User) => {
    const newRole = user.role === 'admin' ? 'user' : 'admin';
    try {
      await updateDoc(doc(db, 'users', user.id), { role: newRole });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `users/${user.id}`);
    }
  };

  const deleteUser = async (userId: string) => {
    if (!confirm('Tem certeza que deseja excluir este usuário? (Nota: O acesso no Firebase Auth deve ser removido manualmente no console)')) return;
    try {
      await deleteDoc(doc(db, 'users', userId));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `users/${userId}`);
    }
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <UsersIcon className="w-6 h-6 text-blue-600" />
            Gestão de Usuários
          </h1>
          <p className="text-slate-500">Controle quem tem acesso ao sistema e seus níveis de permissão.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl font-semibold flex items-center gap-2 shadow-lg shadow-blue-200 transition-all shrink-0"
        >
          <UserPlus className="w-5 h-5" />
          Novo Usuário
        </button>
      </div>

      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
        <div className="relative max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Pesquisar usuários..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
          />
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Usuário</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Função</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Criado em</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold uppercase">
                        {user.name.charAt(0)}
                      </div>
                      <span className="text-sm font-semibold text-slate-900">{user.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500">
                    {user.email}
                  </td>
                  <td className="px-6 py-4">
                    <button 
                      onClick={() => toggleRole(user)}
                      className={cn(
                        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold transition-colors",
                        user.role === 'admin' ? "bg-purple-50 text-purple-600 hover:bg-purple-100" : "bg-blue-50 text-blue-600 hover:bg-blue-100"
                      )}
                    >
                      {user.role === 'admin' ? <ShieldCheck className="w-3 h-3" /> : <Shield className="w-3 h-3" />}
                      {user.role === 'admin' ? 'Administrador' : 'Operador'}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => deleteUser(user.id)}
                        className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Novo Usuário */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-blue-600" />
                Cadastrar Novo Usuário
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            <form onSubmit={handleCreateUser} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Nome Completo</label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input 
                    type="text" required
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500/20"
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    placeholder="Nome do funcionário"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Email de Acesso</label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input 
                    type="email" required
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500/20"
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                    placeholder="exemplo@logistock.com"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Palavra-passe Inicial</label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input 
                    type="password" required minLength={6}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500/20"
                    value={formData.password}
                    onChange={e => setFormData({...formData, password: e.target.value})}
                    placeholder="Mínimo 6 caracteres"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Nível de Acesso</label>
                <select 
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500/20"
                  value={formData.role}
                  onChange={e => setFormData({...formData, role: e.target.value as 'admin' | 'user'})}
                >
                  <option value="user">Operador (Apenas Entradas/Saídas)</option>
                  <option value="admin">Administrador (Acesso Total)</option>
                </select>
              </div>
              <div className="pt-4">
                <button 
                  type="submit" 
                  disabled={creating}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl shadow-lg shadow-blue-200 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {creating ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <UserPlus className="w-5 h-5" />}
                  Criar Conta de Acesso
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
