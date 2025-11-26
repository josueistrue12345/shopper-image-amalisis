// ignore_for_file: avoid_web_libraries_in_flutter

import 'dart:html' as html;
import 'dart:typed_data';

import 'package:uuid/uuid.dart';

class TypeOfEvidence {
  String? id;
  String? name;
  String? path;
  int? type;
  Uint8List? bytes;
  html.File? file;

  TypeOfEvidence({
    String? id,
    this.name = '',
    this.path = '',
    this.bytes,
    this.file ,
    this.type = 0,
  }) : id = id ?? const Uuid().v4();

  factory TypeOfEvidence.fromJson(Map<String, dynamic> json) {
    return TypeOfEvidence(
      id: json['id'] as String?,
      name: json['name'] as String?,
      path: json['path'] as String?,
      type: json['type'] as int?,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'path': path,
      'type': type,
    };
  }
}