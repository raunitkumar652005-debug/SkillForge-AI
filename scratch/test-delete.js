const run = async () => {
  const res = await fetch('http://localhost:3000/api/chat/history/all');
  const data = await res.json();
  console.log('Conversations:', data);
  if (data.conversations && data.conversations.length > 0) {
    const id = data.conversations[0]._id;
    console.log('Trying to delete:', id);
    const delRes = await fetch(`http://localhost:3000/api/chat/history/${id}`, { method: 'DELETE' });
    const delData = await delRes.text();
    console.log('Delete response:', delRes.status, delData);
  }
}
run();
