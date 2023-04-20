using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using UserService1.Models;
using WorldCitiesAPI.Data;

namespace UserService1.Repositories
{
    public class UserRepository : IUserRepository
    {
        private readonly ApplicationDbContext _context;

        public UserRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<User> CreateUserAsync(User newUser)
        {
            _context.Users.Add(newUser);
            await _context.SaveChangesAsync();

            return newUser;
        }

        public async Task DeleteUserAsync(Guid id)
        {
            var user = await _context.Users.FirstOrDefaultAsync(x => x.Id == id);

            if (user == null)
            {
                throw new ArgumentNullException($"product '{id}' is null");
            }

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();
        }

        public async Task<User> FindUserByIdAsync(Guid id)
        {
            var user = await _context.Users.FirstOrDefaultAsync(x => x.Id == id);

            if (user == null)
            {
                throw new ArgumentNullException($"product '{id}' is null");
            }

            return user;
        }

        public async Task<IEnumerable<User>> ListUsersAsync()
        {
            return await _context.Users.ToListAsync();
        }
    }
}
