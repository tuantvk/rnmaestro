import React, { useState } from 'react';
import {
  View,
  Alert,
  SafeAreaView,
  TextInput,
  Button,
  FlatList,
} from 'react-native';

const TASKS = Array.from({ length: 25 }, (_, i) => ({ title: 'Task ' + i }));

interface Item {
  title: string;
}

const App = () => {
  const [title, setTitle] = useState('');
  const [tasks, setTasks] = useState(TASKS);

  const addTask = () => {
    if (title?.trim()?.length === 0) {
      Alert.alert('Title is required');
    } else {
      const newTasks = [...tasks];
      newTasks.unshift({ title });
      setTasks(newTasks);
      setTitle('');
    }
  };

  const renderItem = ({ item }: { item: Item }) => (
    <Button title={item?.title} onPress={() => Alert.alert(item?.title)} />
  );

  const keyExtractor = (item: Item, idx: number) => `${idx}`;

  return (
    <SafeAreaView>
      <FlatList
        data={tasks}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        ListHeaderComponent={
          <View>
            <TextInput
              value={title}
              placeholder="Enter your title"
              onChangeText={setTitle}
            />
            <Button testID="btn_add_task" title="Add task" onPress={addTask} />
          </View>
        }
      />
    </SafeAreaView>
  );
};

export default App;
