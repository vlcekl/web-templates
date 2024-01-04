export function reactive(obj, callback) {
    const handler = {
        get(target, property, receiver) {
            const result = Reflect.get(target, property, receiver);
            if (result && typeof result === 'object') {
                return reactive(result, callback);
            }
            return result;
        },
        set(target, property, value, receiver) {
            const oldValue = target[property];
            const result = Reflect.set(target, property, value, receiver);
            if (oldValue !== value) {
                callback(value, oldValue);
            }
            return result;
        }
    };

    return new Proxy(obj, handler);
}

/*
// Usage
const data = reactive({
    user: {
        name: 'Alice',
        details: {
            age: 25,
            location: 'Wonderland'
        }
    }
}, (newValue, oldValue) => {
    console.log(`Value changed from ${oldValue} to ${newValue}`);
});

// Test the reactivity
data.user.name = 'Bob'; // Triggers callback
data.user.details.age = 30; // Triggers callback
*/