const redis = require('redis');
const axios = require('axios');
const Task = require('../model/Task');

// Create a Redis client
const redisClient = redis.createClient({
    host: '127.0.0.1',
    port: 6379,
});

// Connect to the Redis server
redisClient.connect().catch((err) => {
    console.error('Could not connect to Redis:', err);
});

// Handle Redis connection errors
redisClient.on('error', (err) => {
    console.error('Redis error:', err);
});

const TaskService = {
    addTask: async function (title, description, priority, status, deadline) {
        const task = new Task({
            title,
            description,
            priority,
            status,
            deadline,
        });

        try {
            await task.save();
            await redisClient.del('tasks');

            console.log("Cache Invalidated");
            return task
        } catch (e) {
            return e;
        }
    },

    updateTask: async function (title, description, priority, status, deadline, taskId) {

        try {

            const task = await Task.findById(taskId);

            if (task) {
                await task.updateOne({ title: title, description: description, priority: priority, status: status, deadline: deadline })

                // Invalidate the cache for tasks
                await redisClient.del('tasks');
                console.log("Cache Invalidated");

                return { message: 'Task updated successfully' }
            }

        } catch (e) {
            return e;
        }
    },

    getTasks: async () => {
        try {
            // Check Redis cache first
            const cachedTasks = await redisClient.get('tasks');

            if (cachedTasks) {
                // If cache exists, return the cached data
                console.log("Served from Cache");
                return { data: JSON.parse(cachedTasks) }
            }

            console.log("Cache Missed!!! Fethcing from the Database.");
            const tasks = await Task.find();

            await redisClient.set('tasks', JSON.stringify(tasks), {
                EX: 3600, // Cache expires in 1 hour
            });

            return { data: tasks }
        } catch (error) {
            return error;
        }
    },

    getTask: async (taskId) => {
        try {
            const task = await Task.findById(taskId);
            return { data: task }
        } catch (error) {
            return error;
        }
    },
    deleteTask: async (taskId) => {
        try {
            await Task.deleteOne({ _id: taskId });

            // Invalidate the cache for tasks
            await redisClient.del('tasks');
            console.log("Cache Invalidated");

            return { message: 'Task deleted successfully' }
        } catch (error) {
            return error;
        }
    }

}
module.exports = TaskService;