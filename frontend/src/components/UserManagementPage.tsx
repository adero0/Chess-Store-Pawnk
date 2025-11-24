import React, { useEffect, useState } from 'react';
import type { UserDto, RoleDto, CategoryDto } from '../types/dto';
import { getAllUsers, deleteUser, updateUserRoles, updateUser } from '../api/userService';
import { getAllCategories } from '../api/categoryService';

const UserManagementPage: React.FC = () => {
    const [users, setUsers] = useState<UserDto[]>([]);
    const [categories, setCategories] = useState<CategoryDto[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [editingUser, setEditingUser] = useState<UserDto | null>(null);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [moderatorCategorySelections, setModeratorCategorySelections] = useState<Map<number, number>>(new Map());

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                setLoading(true);
                const [usersData, categoriesData] = await Promise.all([
                    getAllUsers(),
                    getAllCategories()
                ]);
                setUsers(usersData);
                setCategories(categoriesData);

                const initialSelections = new Map<number, number>();
                usersData.forEach(user => {
                    const moderatorRole = user.roles.find(role => role.name === 'ROLE_MODERATOR');
                    if (moderatorRole && moderatorRole.categoryId) {
                        initialSelections.set(user.id, moderatorRole.categoryId);
                    } else if (categoriesData.length > 0) {
                        initialSelections.set(user.id, categoriesData[0].id);
                    }
                });
                setModeratorCategorySelections(initialSelections);

            } catch (err) {
                setError('Failed to fetch data.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchInitialData();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const data = await getAllUsers();
            setUsers(data);
        } catch (err) {
            setError('Failed to fetch users.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteUser = async (userId: number) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                await deleteUser(userId);
                fetchUsers(); // Refresh the list
            } catch (err) {
                setError('Failed to delete user.');
                console.error(err);
            }
        }
    };

    const handleRoleChange = async (userId: number, currentRoles: RoleDto[], roleName: 'ROLE_USER' | 'ROLE_MODERATOR' | 'ROLE_ADMIN', isChecked: boolean) => {
        let newRoles: RoleDto[] = [...currentRoles];

        if (isChecked) {
            if (!newRoles.some(role => role.name === roleName)) {
                const newRole: RoleDto = { id: 0, name: roleName }; // id will be ignored by backend
                if (roleName === 'ROLE_MODERATOR') {
                    const categoryId = moderatorCategorySelections.get(userId);
                    if (categoryId) {
                        newRole.categoryId = categoryId;
                    } else if (categories.length > 0) {
                        newRole.categoryId = categories[0].id;
                        const newSelections = new Map(moderatorCategorySelections);
                        newSelections.set(userId, categories[0].id);
                        setModeratorCategorySelections(newSelections);
                    }
                }
                newRoles.push(newRole);
            }
        } else {
            if (newRoles.length === 1) {
                alert("A user must have at least one role.");
                return;
            }
            newRoles = newRoles.filter(role => role.name !== roleName);
        }

        try {
            await updateUserRoles(userId, newRoles);
            fetchUsers(); // Refresh the list
        } catch (err) {
            setError('Failed to update user roles.');
            console.error(err);
        }
    };

    const handleModeratorCategoryChange = async (userId: number, categoryId: number) => {
        const newSelections = new Map(moderatorCategorySelections);
        newSelections.set(userId, categoryId);
        setModeratorCategorySelections(newSelections);

        const user = users.find(u => u.id === userId);
        if (user && user.roles.some(r => r.name === 'ROLE_MODERATOR')) {
            const newRoles: RoleDto[] = user.roles.map(role => {
                if (role.name === 'ROLE_MODERATOR') {
                    return { ...role, categoryId: categoryId };
                }
                return role;
            });
            try {
                await updateUserRoles(userId, newRoles);
                fetchUsers(); // Refresh the list
            } catch (err) {
                setError('Failed to update user roles.');
                console.error(err);
            }
        }
    };

    const handleEditUser = (user: UserDto) => {
        setEditingUser(user);
        setUsername(user.username);
        setEmail(user.email);
    };

    const handleUpdateUser = async (e: React.FormEvent) => {
        e.preventDefault();
        if (editingUser) {
            try {
                await updateUser(editingUser.id, { username, email });
                setEditingUser(null);
                fetchUsers();
            } catch (err) {
                setError('Failed to update user.');
                console.error(err);
            }
        }
    };

    if (loading) {
        return <div style={{ padding: '2rem' }}>Loading users...</div>;
    }

    if (error) {
        return <div style={{ padding: '2rem', color: 'var(--color-error)' }}>Error: {error}</div>;
    }

    return (
        <div style={{ padding: '2rem' }}>
            <h1>Zarządzanie Użytkownikami</h1>
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
                <thead>
                    <tr style={{ backgroundColor: 'var(--color-surface)' }}>
                        <th style={{ padding: '0.75rem', border: '1px solid var(--color-border)', textAlign: 'left' }}>ID</th>
                        <th style={{ padding: '0.75rem', border: '1px solid var(--color-border)', textAlign: 'left' }}>Nazwa Użytkownika</th>
                        <th style={{ padding: '0.75rem', border: '1px solid var(--color-border)', textAlign: 'left' }}>Email</th>
                        <th style={{ padding: '0.75rem', border: '1px solid var(--color-border)', textAlign: 'left' }}>Role</th>
                        <th style={{ padding: '0.75rem', border: '1px solid var(--color-border)', textAlign: 'left' }}>Akcje</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user.id} style={{ backgroundColor: 'var(--color-background)' }}>
                            <td style={{ padding: '0.75rem', border: '1px solid var(--color-border)' }}>{user.id}</td>
                            <td style={{ padding: '0.75rem', border: '1px solid var(--color-border)' }}>{user.username}</td>
                            <td style={{ padding: '0.75rem', border: '1px solid var(--color-border)' }}>{user.email}</td>
                            <td style={{ padding: '0.75rem', border: '1px solid var(--color-border)' }}>
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={user.roles.some(role => role.name === 'ROLE_USER')}
                                        disabled={user.roles.length === 1 && user.roles[0].name === 'ROLE_USER'}
                                        onChange={(e) => handleRoleChange(user.id, user.roles, 'ROLE_USER', e.target.checked)}
                                    />
                                    User
                                </label>
                                <label style={{ marginLeft: '10px' }}>
                                    <input
                                        type="checkbox"
                                        checked={user.roles.some(role => role.name === 'ROLE_MODERATOR')}
                                        disabled={user.roles.length === 1 && user.roles[0].name === 'ROLE_MODERATOR'}
                                        onChange={(e) => handleRoleChange(user.id, user.roles, 'ROLE_MODERATOR', e.target.checked)}
                                    />
                                    Moderator
                                    {user.roles.some(role => role.name === 'ROLE_MODERATOR') && (
                                        <select
                                            style={{ marginLeft: '5px' }}
                                            value={moderatorCategorySelections.get(user.id) || ''}
                                            onChange={(e) => handleModeratorCategoryChange(user.id, parseInt(e.target.value, 10))}
                                        >
                                            {categories.map(cat => (
                                                <option key={cat.id} value={cat.id}>
                                                    {cat.name}
                                                </option>
                                            ))}
                                        </select>
                                    )}
                                </label>
                                <label style={{ marginLeft: '10px' }}>
                                    <input
                                        type="checkbox"
                                        checked={user.roles.some(role => role.name === 'ROLE_ADMIN')}
                                        disabled={user.roles.length === 1 && user.roles[0].name === 'ROLE_ADMIN'}
                                        onChange={(e) => handleRoleChange(user.id, user.roles, 'ROLE_ADMIN', e.target.checked)}
                                    />
                                    Admin
                                </label>
                            </td>
                            <td style={{ padding: '0.75rem', border: '1px solid var(--color-border)' }}>
                                <button onClick={() => handleEditUser(user)}>Edytuj</button>
                                <button
                                    onClick={() => handleDeleteUser(user.id)}
                                    style={{
                                        backgroundColor: 'var(--color-error)',
                                        color: 'var(--color-text-on-primary)',
                                        border: 'none',
                                        padding: '0.0rem 0.5rem',
                                        borderRadius: 'var(--border-radius)',
                                        cursor: 'pointer',
                                        fontSize: '1rem',
                                        marginLeft: '10px'
                                    }}
                                >
                                    Usuń
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {editingUser && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <div style={{ backgroundColor: 'var(--color-surface)', padding: '2rem', borderRadius: 'var(--border-radius)' }}>
                        <h2>Edit User</h2>
                        <form onSubmit={handleUpdateUser}>
                            <div style={{ marginBottom: '1rem' }}>
                                <label htmlFor="username">Username</label>
                                <input
                                    type="text"
                                    id="username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                    style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--border-radius)', border: '1px solid var(--color-border)' }}
                                />
                            </div>
                            <div style={{ marginBottom: '1rem' }}>
                                <label htmlFor="email">Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--border-radius)', border: '1px solid var(--color-border)' }}
                                />
                            </div>
                            <button type="submit" style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--border-radius)', border: 'none', backgroundColor: 'var(--color-primary)', color: 'var(--color-text-on-primary)', cursor: 'pointer' }}>
                                Update User
                            </button>
                            <button onClick={() => setEditingUser(null)} style={{ width: '100%', marginTop: '1rem', padding: '0.75rem', borderRadius: 'var(--border-radius)', border: 'none', backgroundColor: 'var(--color-error)', color: 'var(--color-text-on-primary)', cursor: 'pointer' }}>
                                Cancel
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserManagementPage;
