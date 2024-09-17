package main

import (
    "fmt"
    "log"
    "time"
    "context"
    "net/http"    
    "encoding/json"
    "github.com/gorilla/mux"
     "github.com/go-redis/redis/v8"
    "go.mongodb.org/mongo-driver/bson"
    "go.mongodb.org/mongo-driver/mongo"
    "go.mongodb.org/mongo-driver/mongo/options"
)

var (
    client       *mongo.Client
    redisClient  *redis.Client
    redisCtx     = context.Background()
)

type Task struct {
    Title       string  `json:"title"`
    Status      string  `json:"status"`
    Deadline    string  `json:"deadline"`
    Priority    string  `json:"priority"`    
    Description string  `json:"description"`
}

func connectMongoDB() {
    var err error
    ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
    defer cancel()
    client, err = mongo.Connect(ctx, options.Client().ApplyURI("mongodb://localhost:27017"))
    if err != nil {
        log.Fatal(err)
    }
    fmt.Println("Connected to MongoDB!")
}

func connectRedis() {
    redisClient = redis.NewClient(&redis.Options{
        Addr:     "localhost:6379", 
        Password: "",               
        DB:       0,                
    })

    _, err := redisClient.Ping(redisCtx).Result()
    if err != nil {
        log.Fatal(err)
    }
    fmt.Println("Connected to Redis!")
}

func createTask(w http.ResponseWriter, r *http.Request) {
    var tasks []Task
    decoder := json.NewDecoder(r.Body)

    decoder.DisallowUnknownFields() // Optional: Disallow unknown fields in JSON to catch errors
    if err := decoder.Decode(&tasks); err != nil {
        log.Printf("Error decoding request body: %v", err)
        http.Error(w, "Invalid JSON format", http.StatusBadRequest)
        return
    }

    collection := client.Database("opika-task-management-db").Collection("tasks")
    ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
    defer cancel()

    // Prepare documents for bulk insertion
    var documents []interface{}
    for _, task := range tasks {
        // Add task to the documents slice, converting CreatedAt to time.Time
        documents = append(documents, bson.M{
            "title":        task.Title,
            "status":       task.Status,
            "deadline":     task.Deadline,
            "priority":     task.Priority,                      
            "description":  task.Description,
        })
    }

    collection.InsertMany(ctx, documents)

    //Evicting Cache
    redisClient.Del(redisCtx, "tasks")
    fmt.Println("Cache Invalidated!")

    // Return a success response
    w.WriteHeader(http.StatusCreated)
    json.NewEncoder(w).Encode(map[string]string{"message": "Tasks successfully created"})
}

func main() {
    connectRedis()
    connectMongoDB()
    router := mux.NewRouter()
    router.HandleFunc("/api/v1/tasks", createTask).Methods("POST")
    http.ListenAndServe(":8080", router)
}